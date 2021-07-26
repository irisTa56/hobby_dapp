import React, { useState, useEffect } from "react";

type EventHandler<EventT> = (e: EventT) => void;
type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent>;

export function useLazyState<T>(initState: T, fetcher: () => T | Promise<T>): [T, () => Promise<void>] {
  const [state, setState] = useState<T>(initState);
  const updater = async () => {
    setState(await fetcher());
  };
  useEffect(() => {
    updater();
  }, []);
  return [state, updater];
}

export function useButtonClick(callback: () => void | Promise<void>): EventHandler<ButtonEvent> {
  const [isClicked, setIsClicked] = React.useState<boolean>(false);
  useEffect(() => {
    if (isClicked) {
      setIsClicked(false);
      callback();
    }
  }, [isClicked]);
  return (e: ButtonEvent) => {
    setIsClicked(true);
    e.currentTarget.blur();
  };
}
