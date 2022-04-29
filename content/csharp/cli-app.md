---
title: Creating C# CLI App
date: "2022-03-27"
description: "Simple example of C# CLI application with Microsoft.Extensions.CommandLineUtils, MediatR and Serilog"
---

## Initial Setup

We will create a simple `c#` application which will be able to run conventional `CLI` interface with mandatory arguments and optional parameters. Our app will have simple logging, provided by `Serilog`
and `CQRS` pattern with `MediatR`.

At the beginning we need to create a new solution, `CLI` and `Business` projects:

```bash
dotnet new sln -o charp-cli-app
cd charp-cli-app
dotnet new console -o CLI
dotnet new console -o Business
dotnet sln add CLI Business
```

Our project will have simple business and presentation layering, where `Business` is a stable component
and presentational `CLI` project will depend on it. This means, we need to create references between projects:

```bash
dotnet add ./CLI reference Business
```

This will create a reference inside `CLI/CLI.csproj` file:

```xml
<ItemGroup>
    <ProjectReference Include="..\Business\Business.csproj" />
</ItemGroup>
```

We created solution and two empty projects with proper references. Now we need to add external dependencies for our project.

In `CLI` project add:

- `Serilog` library for logging
- `Serilog.Sinks.Console` allows to configure logging into terminal
- `Serilog.Extensions.Logging` - it allows to use Serilog with standard `ILogger<T>` interface
- `Microsoft.Extensions.CommandLineUtils` NuGet to easily parse arguments and create commands

```bash
dotnet add ./CLI package Serilog -v <version>
dotnet add ./CLI package Serilog.Sinks.Console -v <version>
dotnet add ./CLI package Serilog.Extensions.Logging -v <version>
dotnet add ./CLI package Microsoft.Extensions.CommandLineUtils -v <version>
```

This will create in `CLI/CLI.csproj` file following lines:

```xml
<ItemGroup>
    <PackageReference Include="Microsoft.Extensions.CommandLineUtils" Version="<version>" />
    <PackageReference Include="Serilog" Version="<version>" />
    <PackageReference Include="Serilog.Extensions.Logging" Version="<version>" />
    <PackageReference Include="Serilog.Sinks.Console" Version="<version>" />
</ItemGroup>
```

Then add to `Business`:

- `MediatR` - simple request/response library
- `Microsoft.Extensions.Logging` - contains standard logging functionality, which we will use for `DI`

```bash
dotnet add ./Business package MediatR -v <version>
dotnet add ./Business Microsoft.Extensions.Logging -v <version>
```

```xml
<ItemGroup>
    <PackageReference Include="MediatR" Version="<version>" />
    <PackageReference Include="Microsoft.Extensions.Logging" Version="<version>" />
</ItemGroup>
```

_Need to specify particular version of packages instead of <version>, because it is always a subject to change_

## Implementing Business

Unlike real life in our study cli app business does not have a big value. To imitate it we simply will
use basic mathematical operations.

To be more conventional and a little bit follow TDD, create new test project:

```bash
dotnet new xunit -o Tests
dotnet add ./Tests reference ./Business
dotnet sln add Tests
```

And create new class `CalculatorTests` in tests project and create simple tests for our business:

```csharp
namespace Tests;

public class CalculatorTests
{
    [Theory]
    [InlineData(2, 1, 3)]
    public void ShouldAddTwoValues__WhenNoOverflow(int x, int y, int expectedResult)
    {
        // arrange
        var calculator = new Calculator();
        // act
        var result = calculator.Add(x, y);
        // assert
        result.Should().Be(expectedResult);
    }
}
```

In business project create two interfaces. First `ICalculator`:

```csharp
namespace Business;

public interface ICalculator
{
    public int Add(int x, int y);
}
```

And second `IFileService` - it will be used if optional parameter to save result into file will be
passed:

```csharp
namespace Business.Interfaces;

public interface IFileService
{
    Task SaveToFileAsync(string path, string content);
}
```

Then create implementation in `Business`:

```csharp
namespace Business;

public class Calculator : ICalculator
{
    public int Add(int x, int y)
    {
        return x + y;
    }
}
```

This is a quite naive implementation, but it's enough for our purpose of building CLI application 😜

Implementation of `IFileService` we'll create in `CLI/Services` because it is not strictly related to
our business, but to infrastructure:

```csharp
namespace CLI.Services;

public class FileService : IFileService
{
    public async Task SaveToFileAsync(string path, string content)
    {
        if (File.Exists(path))
        {
            await File.AppendAllTextAsync(path, content, ct);
        }
        else
        {
            await File.WriteAllTextAsync(path, content, ct);
        }
    }
}
```

Now as our tests pass, we can move to implementation of our `CLI`.

## CLI Project Configuration

At the beginning we have to create `DI` container and register our dependencies.
To do it, write following in `CLI/Program.cs` file:

```csharp
var serviceProvider = new ServiceCollection()
    .AddSingleton<ICalculator, Calculator>()
    .AddSingleton<IFileService, FileService>()
    .BuildServiceProvider();
```

**Configuring Logging:**

Create file `ConfigurationExtensions.cs` file in `CLI` project with content:

```csharp
namespace CLI;

public static class ConfigurationExtensions
{
    public static IServiceCollection AddSerilogLogging(this IServiceCollection services)
    {
        var logger = new LoggerConfiguration()
            .WriteTo.Console()
            .CreateLogger();

        services.AddLogging(builder =>
        {
            builder.SetMinimumLevel(LogLevel.Trace);
            builder.AddSerilog(logger, dispose: true);
        });

        return services;
    }
}
```

This will setup logging with `Serilog` to console and allows to use loggers with dependency injection.
Now we can use this extension on our `DI` container in `Program.cs`:

```csharp
var serviceProvider = new ServiceCollection()
    .AddSerilogLogging()
    .AddSingleton<ICalculator, Calculator>()
    .AddSingleton<IFileService, FileService>()
    .BuildServiceProvider();
```

**MediatR:**

Now creating `MediatR` command for adding numbers in `Business/Requests` folder:

```csharp
namespace Business.Requests;

public record AddNumbersCommand(int X, int Y, string? ResultPath) : IRequest<int>
{ }
```

Command contains `nullable` ResultPath. If it exists we will save result to file by this provided path.

And handler for it in `Business/Handlers`:

```csharp
namespace Business.Handlers;

public class AddNumbersHandler : IRequestHandler<AddNumbersCommand>
{
    private readonly ILogger<AddNumbersHandler> _logger;
    private readonly ICalculator _calculator;
    private readonly IFileService _fileService;

    public AddNumbersHandler(
        ILogger<AddNumbersHandler> logger,
        ICalculator calculator,
        IFileService fileService
    )
    {
        _logger = logger;
        _calculator = calculator;
        _fileService = fileService;
    }

    public async Task<Unit> Handle(AddNumbersCommand request, CancellationToken ct)
    {
        var (x, y, resultPath) = request;
        try
        {
            _logger.LogInformation("Adding values {X} and {Y}", x, y);
            var result = _calculator.Add(x, y);
            _logger.LogInformation("Calculated result: {Result}", result);

            if (resultPath is not null)
            {
                _logger.LogInformation("Saving result to file {Path}", resultPath);
                var content = $"Adding {x} + {y} = {result}\n";
                await _fileService.SaveToFileAsync(resultPath, content, ct);
                _logger.LogInformation("Result saved");
            }

            return Unit.Value;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error happened during handling addition of values {X} and {Y}", x, y);
            throw;
        }
    }
}
```

To register `MediatR` with `DI` container add it to `ServiceProvider` configuration in `Program.cs`:

```csharp
var serviceProvider = new ServiceCollection()
    .AddSerilogLogging()
    .AddMediatR(typeof(AddNumbersHandler).Assembly)
    .AddSingleton<ICalculator, Calculator>()
    .AddSingleton<IFileService, FileService>()
    .BuildServiceProvider();
```

## CLI

Now we can start to create a main part of this guide - CLI parameters parsing and routing them to
proper command handler.

In `Program.cs` file add following code, which creates `Microsoft.Extensions.CommandLineUtils` app:

```csharp
var app = new CommandLineApplication();
app.Name = "CSharp CLI Application";
app.Description = "Simple C# console application";
app.HelpOption("-h|--help");
```

Here we create command line app object, where define it's name, description and define command to get help.

Next we will configure `add numbers` command.

```csharp
var mediator = serviceProvider.GetRequiredService<IMediator>();
var logger = serviceProvider.GetRequiredService<ILogger<Program>>();

app.Command("add", (opt) =>
{
    var x = opt.Argument(
        name: "<x>",
        description: "first number"
    );
    var y = opt.Argument(
        name: "<y>",
        description: "second number"
    );
    var resultPath = opt.Option(
        template: "-rp|--result-path",
        description: "file path to save result",
        CommandOptionType.SingleValue
    );
    opt.HelpOption("-h|--help");

    opt.OnExecute(async () =>
    {
        try
        {
            if (!int.TryParse(x.Value, out var xInt))
            {
                throw new ArgumentException($"first argument {x.Value} is not a number");
            }
            if (!int.TryParse(y.Value, out var yInt))
            {
                throw new ArgumentException($"first argument {y.Value} is not a number");
            }

            var command = new AddNumbersCommand
            (
                X: xInt,
                Y: yInt,
                ResultPath: resultPath.Values.Count > 0 ? resultPath.Values[0] : null
            );
            await mediator.Send(command);
            return 0;
        }
        catch (ArgumentException e)
        {
            logger.LogError("Error happened: {Message}", e.Message);
            return 1;
        }
        catch (Exception)
        {
            return 1;
        }
    });
});

app.Execute(args);
```

Here with `app.Command()` we create command handler with name `add`. If we run `--help` command of our app(inside of `./CLI` project) we will see something like this:

```log
$: dotnet run -- --help


Usage: CSharp CLI Application [options] [command]

Options:
  -h|--help  Show help information

Commands:
  add

Use "CSharp CLI Application [command] --help" for more information about a command.
```

Then inside of command handler delegate we define arguments - first and second numbers to add and optional parameters - file path to save result and define help option for `add` command.

And finally with `opt.OnExecute` we define handler function, which will be executed to handle `add` command.
Inside of this handler we specify logic to parse arguments to their target types and handling of
possible parsing errors. When we have parsed parameters, using `mediator` we route our data to
proper `add numbers` handler.

Running help for `add` command in our `CLI` project we will get following result:

```log
$: dotnet run -- add --help


Usage: CSharp CLI Application add [arguments] [options]

Arguments:
  <x>  first number
  <y>  second number

Options:
  -rp|--result-path  file path to save result
  -h|--help          Show help information
```

Now we can test our app. Running it with valid data gives following:

```log
$: dotnet run -- add 2 2

[23:10:46 INF] Adding values 2 and 2
[23:10:46 INF] Calculated result: 4
```

Running with optional file path for saving result:

```log
$: dotnet run -- add 2 2 --result-path results.txt

[23:11:59 INF] Adding values 2 and 2
[23:11:59 INF] Calculated result: 4
[23:11:59 INF] Saving result to file results.txt
[23:11:59 INF] Result saved
```

And also file `results.txt` will be created with content:

```log
Adding 2 + 2 = 4
```

If we provide not valid input for add:

```log
$: dotnet run -- add 2 asf

[23:13:35 ERR] Error happened: Second argument asf is not a number
```

And if we provide command, that does not exist program will return an error:

```log
$: dotnet run -- subtract 2 2

Specify --help for a list of available options and commands.
Unhandled exception. Microsoft.Extensions.CommandLineUtils.CommandParsingException: Unrecognized command or argument 'subtract'
   at Microsoft.Extensions.CommandLineUtils.CommandLineApplication.Execute(String[] args)
   at Program.<Main>$(String[] args) in ./csharp-cli-app/CLI/Program.cs:line 78
```
