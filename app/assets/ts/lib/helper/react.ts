import React from "react";

type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;
type EventHandler<EventT> = (e: EventT) => void;

export function useClick(): [boolean, EventHandler<ButtonEvent>, (callback: () => void) => void] {
  const [isClicked, setIsClicked] = React.useState<boolean>(false);
  const onClick = (e: ButtonEvent) => {
    e.currentTarget.blur();
    setIsClicked(true);
  };
  const afterClicked = (callback: () => void) => {
    if (isClicked) {
      setIsClicked(false);
      callback();
    }
  };
  return [isClicked, onClick, afterClicked];
}
