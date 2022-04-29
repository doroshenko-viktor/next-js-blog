import styles from './ActionItem.module.css';

type Props = {
    caption: string;
    action: () => void;
};

const ActionItem: React.FC<Props> = ({ caption, action }: Props) => {
    return (<>
        <div className={styles.actionItem} onClick={action}>
            {caption}
        </div>
    </>);
};

export default ActionItem;