import type { useLunatic } from "@inseefr/lunatic";

type Props = {
  items: ReturnType<typeof useLunatic>["overview"];
  onClick: (page: number) => void;
};

export function QuestionnaireNavigation({ items, onClick }: Props) {
  return (
    <nav>
      {items.map((item) => (
        <button
          key={item.id}
          aria-current={item.current}
          onClick={() => onClick(parseInt(item.page, 10))}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
