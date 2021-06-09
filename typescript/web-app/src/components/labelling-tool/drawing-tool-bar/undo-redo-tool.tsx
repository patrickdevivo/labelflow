import { IconButton, Tooltip } from "@chakra-ui/react";
import { BiUndo, BiRedo } from "react-icons/bi";
import { useHotkeys } from "react-hotkeys-hook";

import { useUndoStore } from "../../../connectors/undo-store";

import { keymap } from "../../../keymap";

export type Props = {};

export const UndoTool = () => {
  const { undo, canUndo } = useUndoStore();

  useHotkeys(
    keymap.undo.key,
    () => {
      undo();
    },
    {},
    []
  );

  return (
    <Tooltip label={`Undo tool [${keymap.undo.key}]`} placement="right">
      <IconButton
        icon={<BiUndo size="1.3em" />}
        onClick={undo}
        backgroundColor="white"
        aria-label="Undo tool"
        pointerEvents="initial"
        isDisabled={!canUndo()}
      />
    </Tooltip>
  );
};

export const RedoTool = () => {
  const { redo, canRedo } = useUndoStore();

  useHotkeys(
    keymap.redo.key,
    () => {
      redo();
    },
    {},
    []
  );

  return (
    <Tooltip label={`Redo tool [${keymap.redo.key}]`} placement="right">
      <IconButton
        icon={<BiRedo size="1.3em" />}
        onClick={redo}
        backgroundColor="white"
        aria-label="Redo tool"
        pointerEvents="initial"
        isDisabled={!canRedo()}
      />
    </Tooltip>
  );
};
