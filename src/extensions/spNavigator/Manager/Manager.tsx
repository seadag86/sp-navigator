import * as React from "react";
import { Link } from "office-ui-fabric-react/lib/Link";
import {
  DetailsList,
  Selection,
  IColumn,
  buildColumns,
  IColumnReorderOptions,
  IDragDropEvents,
  IDragDropContext
} from "office-ui-fabric-react/lib/DetailsList";
import { MarqueeSelection } from "office-ui-fabric-react/lib/MarqueeSelection";
import { getTheme, mergeStyles } from "office-ui-fabric-react/lib/Styling";
import { IMenuItem } from "../Menu/Menu";
import styles from "./Manager.module.scss";

const theme = getTheme();
const dragEnterClass = mergeStyles({
  backgroundColor: theme.palette.neutralLight
});
const controlWrapperClass = mergeStyles({
  display: "flex",
  flexWrap: "wrap"
});

export interface IManagerState {
  items: Partial<IMenuItem>[];
  columns: IColumn[];
  isColumnReorderEnabled: boolean;
  frozenColumnCountFromStart: string;
  frozenColumnCountFromEnd: string;
}

export interface IManagerProps {
  items: IMenuItem[];
}

export class Manager extends React.Component<IManagerProps, IManagerState> {
  private _selection: Selection;
  private _dragDropEvents: IDragDropEvents;
  private _draggedItem: IMenuItem | undefined;
  private _draggedIndex: number;

  constructor(props: IManagerProps) {
    super(props);

    this._selection = new Selection();
    this._dragDropEvents = this._getDragDropEvents();
    this._draggedIndex = -1;
    const { items } = props;

    console.log(items);
    const indentation = (str: string, times: number): string => {
      let repeatedString = "";

      while (times > 0) {
        repeatedString += str;
        times--;
      }

      return repeatedString;
    };

    const extractItems = (
      items: IMenuItem[],
      level: number
    ): Partial<IMenuItem>[] => {
      return items.reduce((acc, curVal, i) => {
        const children =
          curVal.children && curVal.children.length
            ? extractItems(curVal.children, level + 1)
            : [];

        return [
          ...acc,
          {
            title: `${indentation("----", level)} ${curVal.title}`,
            url: curVal.title,
            weight: i
          },
          ...children
        ];
      }, []);
    };

    this.state = {
      items: extractItems(items, 0),
      columns: buildColumns(items, true),
      isColumnReorderEnabled: true,
      frozenColumnCountFromStart: "1",
      frozenColumnCountFromEnd: "0"
    };
  }

  public render(): JSX.Element {
    const { items, columns } = this.state;

    return (
      <div>
        <div className={controlWrapperClass}></div>
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            setKey="items"
            items={items}
            columns={columns}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            onItemInvoked={this._onItemInvoked}
            onRenderItemColumn={this._onRenderItemColumn}
            dragDropEvents={this._dragDropEvents}
            columnReorderOptions={
              this.state.isColumnReorderEnabled
                ? this._getColumnReorderOptions()
                : undefined
            }
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
          />
        </MarqueeSelection>
      </div>
    );
  }

  private _handleColumnReorder = (
    draggedIndex: number,
    targetIndex: number
  ) => {
    const draggedItems = this.state.columns[draggedIndex];
    const newColumns: IColumn[] = [...this.state.columns];

    // insert before the dropped item
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItems);
    this.setState({ columns: newColumns });
  };

  private _getColumnReorderOptions(): IColumnReorderOptions {
    return {
      frozenColumnCountFromStart: parseInt(
        this.state.frozenColumnCountFromStart,
        10
      ),
      frozenColumnCountFromEnd: parseInt(
        this.state.frozenColumnCountFromEnd,
        10
      ),
      handleColumnReorder: this._handleColumnReorder
    };
  }

  private _getDragDropEvents(): IDragDropEvents {
    return {
      canDrop: (
        dropContext?: IDragDropContext,
        dragContext?: IDragDropContext
      ) => {
        return true;
      },
      canDrag: (item?: any) => {
        return true;
      },
      onDragEnter: (item?: any, event?: DragEvent) => {
        // return string is the css classes that will be added to the entering element.
        return dragEnterClass;
      },
      onDragLeave: (item?: any, event?: DragEvent) => {
        return;
      },
      onDrop: (item?: any, event?: DragEvent) => {
        if (this._draggedItem) {
          this._insertBeforeItem(item);
        }
      },
      onDragStart: (
        item?: any,
        itemIndex?: number,
        selectedItems?: any[],
        event?: MouseEvent
      ) => {
        this._draggedItem = item;
        this._draggedIndex = itemIndex!;
      },
      onDragEnd: (item?: any, event?: DragEvent) => {
        this._draggedItem = undefined;
        this._draggedIndex = -1;
      }
    };
  }

  private _onItemInvoked = (item: IMenuItem): void => {
    alert(`Item invoked: ${item.title}`);
  };

  private _onRenderItemColumn = (
    item: IMenuItem,
    index: number,
    column: IColumn
  ): JSX.Element | string => {
    const key = column.key as keyof IMenuItem;
    if (key === "title") {
      return <Link data-selection-invoke={true}>{item[key]}</Link>;
    }

    return String(item[key]);
  };

  private _insertBeforeItem(item: Partial<IMenuItem>): void {
    const draggedItems = this._selection.isIndexSelected(this._draggedIndex)
      ? (this._selection.getSelection() as Partial<IMenuItem>[])
      : [this._draggedItem!];

    const items = this.state.items.filter(
      itm => draggedItems.indexOf(itm) === -1
    );
    let insertIndex = items.indexOf(item);

    // if dragging/dropping on itself, index will be 0.
    if (insertIndex === -1) {
      insertIndex = 0;
    }

    items.splice(insertIndex, 0, ...draggedItems);

    this.setState({ items: items });
  }
}
