---
title: Asp.Net Core Project Configuration
date: "2022-03-24"
description: "Configuration of Asp.Net Core project runtime"
---

There are basically several ways to configure runtime of `Asp.Net Core` application:

- command line arguments
- environment variables
- configuration inside of code

## Runtime Command Line Arguments

Configuring ports, which will be listened on runtime of the application:

```bash
dotnet run --urls "http://localhost:5000;https://localhost:5001"
```

Listening urls have to be in specific format for IPv4 - `{scheme}://{loopbackAddress}:{port}` or `{scheme}://{IPAddress}:{port}`.
To listen for any port on available address - `{scheme}://*:{port}`.
If port is omitted, it will fallback to default `80` for `http` and `443` for `https`.

## Configuration Environment Variables

We can configure runtime of such things, like server configuration and

## Configuration With Code

```csharp
Host.CreateDefaultBuilder(args).ConfigureWebHostDefaults(webBuilder =>
{
    webBuilder.UseStartup<Startup>();
    // here we can configure listening ports
    webBuilder.UseUrls("http://localhost:5003", "https://localhost:5004");
});
```

## Resources

- [5 ways to set the URLs for an ASP.NET Core app](https://andrewlock.net/5-ways-to-set-the-urls-for-an-aspnetcore-app/)
