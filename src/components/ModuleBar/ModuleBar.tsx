import styles from "./ModuleBar.module.css";

interface Props {
  title: string;
  titleDescription?: string;
  icon?: string;
  iconDescription?: string;
}

export default function ModuleBar({
  title,
  titleDescription,
  icon,
  iconDescription,
}: Props) {
  return (
    <div className={styles.moduleBar}>
      {icon && (
        <img
          src={icon}
          title={iconDescription}
          alt="Module Icon"
          className="w-8 h-8 inline-block mr-2"
        />
      )}

      {title && (
        <h2 title={titleDescription} className="text-3xl">
          {title}
        </h2>
      )}
    </div>
  );
}
