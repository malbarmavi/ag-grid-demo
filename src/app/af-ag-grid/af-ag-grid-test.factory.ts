function getGridRows(gridOptions) {
    var res = [];
    gridOptions.api.forEachLeafNode(function (node) {
        res.push(node.data);
    });
    return res;
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * @param {Object} gridOptions
 * @param {Object} options
 *                 {
 *                      contextMenu: boolean // if it should replace the context menu with debugging tools 
 *                 }
 * @return {Object} Exposes functionality
 */
export function AgGridTestFactory (gridOptions, options) {
    // ObjectHelpersSvc.createAndSetChainedProperty(gridOptions, 'context.anafee.test', {});
    // var testContainer = gridOptions.context.anafee.test;

    var state = {
        globalListener: null, // handle to the global listener function, so it can be removed
        listenerMode: null, // 
        eventArr: []
    };

    function logGridInfo() {
        console.group("Grid Info");

        console.groupCollapsed("Misc");
        console.log('gridOptions', gridOptions);
        console.log('gridOptions.api', gridOptions.api);
        console.log('gridOptions.columnApi', gridOptions.columnApi);
        console.log('context', gridOptions.context);
        console.groupEnd();

        console.groupCollapsed("Model");
        console.log('getModel', gridOptions.api.getModel());
        console.groupEnd();

        console.groupCollapsed("Column");
        var columnApis = [
            'getAllColumns',
            'getAllGridColumns',
            'getAllDisplayedVirtualColumns',
            'getDisplayedLeftColumns',
            'getDisplayedRightColumns',
            'getAllDisplayedColumns',
        ];
        var autoWidthCalculator = gridOptions.api.getModel().columnController.autoWidthCalculator;
        columnApis.forEach(function (api) {
            var apiResponse = gridOptions.columnApi[api]() || [];
            console.log(api, apiResponse.map(function (column) {
                return {
                    column: column,
                    actualWidth: column.actualWidth,
                    prefferedWidth: autoWidthCalculator.getPreferredWidthForColumn(column)
                };
            }));
            // console.log(api, apiResponse);
            // console.log(api + 'Widths', (apiResponse || []).map(function (column) {
            //     return column.actualWidth;
            // }));
            // console.log(api + 'PrefferedWidths', (apiResponse || []).map(function (column) {
            //     return autoWidthCalculator.getPreferredWidthForColumn(column);
            // }));
            // console.log('');
        });
        console.log('getColumnState', gridOptions.columnApi.getColumnState());
        console.log('getRowGroupColumns', gridOptions.columnApi.getRowGroupColumns());
        console.groupEnd();

        console.groupCollapsed("Row");
        console.log('getDisplayedRowCount', gridOptions.api.getDisplayedRowCount());
        console.log('getFirstDisplayedRow', gridOptions.api.getFirstDisplayedRow());
        console.log('getLastDisplayedRow', gridOptions.api.getLastDisplayedRow());
        console.log('LeafRows', getGridRows(gridOptions));
        console.groupEnd();

        console.groupCollapsed("Selection");
        console.log('getSelectedNodes', gridOptions.api.getSelectedNodes());
        console.log('getSelectedRows', gridOptions.api.getSelectedRows());
        console.log('getRangeSelections', gridOptions.api.getRangeSelections());
        console.groupEnd();

        console.groupCollapsed("Sort and filter");
        console.log('getFilterModel', gridOptions.api.getFilterModel());
        console.log('getSortModel', gridOptions.api.getSortModel());
        console.groupEnd();

        console.log('getFocusedCell', gridOptions.api.getFocusedCell());

        console.groupEnd();
    }

    // ================================================ EVENTS ================================================
    function globalListenerFactory(mode, eventList) {
        return function (eventType, event) {
            var shouldLogEvent = false;
            if (!mode) {
                shouldLogEvent = true;
            } else if (mode === 'whitelist' && eventList.indexOf(eventType) !== -1) {
                shouldLogEvent = true;
            } else if (mode === 'blacklist' && eventList.indexOf(eventType) === -1) {
                shouldLogEvent = true;
            }

            if (shouldLogEvent) {
                console.log(eventType, event);
            }
        };
    }


    function addGlobalListener(mode, eventList) {
        var listenerFunction = globalListenerFactory(mode, eventList);
        gridOptions.api.addGlobalListener(listenerFunction);
        return listenerFunction;
    }

    function removeGlobalListener(listenerFunction) {
        gridOptions.api.removeGlobalListener(listenerFunction);
    }


    // unlike addGlobalListener this also handles the state, allowing only one global listener
    // thus preventing accidentally adding multiple listeners and losing their handles so they can't be removed
    function menuAddGlobalListener(mode, eventList) {
        if (state.globalListener) {
            menuRemoveGlobalListener();
        }
        state.globalListener = addGlobalListener(mode, eventList);
    }

    // unlike removeGlobalListener this also handles the state
    function menuRemoveGlobalListener() {
        if (state.globalListener) {
            removeGlobalListener(state.globalListener);
            state.globalListener = null;
        }
    }

    // ================================================ CONTEXT MENU ================================================
    // ================================================ CONTEXT MENU ================================================
    // ================================================ CONTEXT MENU ================================================
    // ================================================ CONTEXT MENU ================================================
    // ================================================ CONTEXT MENU ================================================
    if (options && options.contextMenu) {
        gridOptions.popupParent = document.querySelector('body');
        gridOptions.getContextMenuItems = getContextMenuItems;
    }

    function createEventSubMenu(eventObj, mode, stateObj) {
        function actionFn() {
            if (stateObj.mode !== mode) {
                stateObj.mode = mode;
                stateObj.eventArr.length = 0;
            }
            if (stateObj.eventArr.indexOf(this.name) === -1) {
                stateObj.eventArr.push(this.name);
            }
            menuAddGlobalListener(mode, stateObj.eventArr);
        }

        var subMenu = [];
        var eventCathegories = Object.keys(eventObj);
        for (var i = 0; i < eventCathegories.length; i++) {
            var currentEventCathegoryName = eventCathegories[i];
            var currentEventCathegory = eventObj[currentEventCathegoryName];
            var childrenArr = [];
            for (var j = 0; j < currentEventCathegory.length; j++) {
                var currentEvent = currentEventCathegory[j];
                childrenArr.push({
                    name: currentEvent,
                    action: actionFn,
                    checked: (stateObj.mode === mode && stateObj.eventArr.indexOf(currentEvent) !== -1)
                });
            }
            subMenu.push({
                name: currentEventCathegoryName,
                subMenu: childrenArr
            });
        }
        return subMenu;
    }
    function createEventMenus(stateObj) {
        var eventObj = {
            "Selection": [
                'cellClicked',
                'cellDoubleClicked',
                'cellFocused',
                'cellMouseOver',
                'cellMouseOut',
                'cellMouseDown',
                'rowClicked',
                'rowDoubleClicked',
                'rowSelected',
                'selectionChanged',
                'cellContextMenu',
                'rangeSelectionChanged'
            ],
            "Editing": [
                'cellValueChanged',
                'rowValueChanged',
                'cellEditingStarted',
                'cellEditingStopped',
                'rowEditingStarted',
                'rowEditingStopped',
                'pasteStart',
                'pasteEnd'
            ],
            "Sort & Filter": [
                'sortChanged',
                'filterChanged',
                'filterModified'
            ],
            "Row Drag & Drop": [
                'rowDragEnter',
                'rowDragMove',
                'rowDragLeave',
                'rowDragEnd'
            ],
            "Columns": [
                'columnVisible',
                'columnPinned',
                'columnResized',
                'columnMoved',
                'columnRowGroupChanged',
                'columnValueChanged',
                'columnPivotModeChanged',
                'columnPivotChanged',
                'columnGroupOpened',
                'newColumnsLoaded',
                'gridColumnsChanged',
                'displayedColumnsChanged',
                'virtualColumnsChanged',
                'columnEverythingChanged'
            ],
            "Miscellaneous": [
                'gridReady',
                'gridSizeChanged',
                'modelUpdated',
                'rowGroupOpened',
                'paginationChanged',
                'pinnedRowDataChanged',
                'virtualRowRemoved',
                'viewportChanged',
                'bodyScroll',
                'dragStarted',
                'dragStopped',
                'rowDataChanged',
                'rowDataUpdated',
                'toolPanelVisibleChanged',
                'componentStateChanged',
                'animationQueueEmpty'
            ],
        };

        var eventMenu = {
            name: 'Event filter (' + stateObj.eventArr.length + ')',
            subMenu: [
                {
                    name: 'Global',
                    action: function () {
                        stateObj.mode = null;
                        stateObj.eventArr.length = 0;
                        menuAddGlobalListener('', '');
                    }
                },
                {
                    name: 'Whitelist' + (stateObj.mode === 'whitelist' ? '(' + stateObj.eventArr.length + ')' : ''),
                    subMenu: createEventSubMenu(eventObj, 'whitelist', stateObj)
                },
                {
                    name: 'Blacklist' + (stateObj.mode === 'blacklist' ? '(' + stateObj.eventArr.length + ')' : ''),
                    subMenu: createEventSubMenu(eventObj, 'blacklist', stateObj)
                }
            ]
        };
        return eventMenu;
    }

    function getContextMenuItems(params) {
        var globalListener;
        return [
            {
                name: 'Log INFO',
                icon: '( i ) ',
                action: logGridInfo,
            }, 'separator',
            {
                name: 'Select all',
                action: function () { params.api.selectAll(); },
            },
            {
                name: 'Deselect all',
                action: function () { params.api.deselectAll(); },
            },
            'separator',
            {
                name: 'Duplicate selected rows',
                action: function () {
                    var selectedRows = params.api.getSelectedRows();
                    params.api.updateRowData({
                        add: copy(selectedRows)
                    });
                },
            },
            {
                name: 'Delete selected rows',
                icon: 'x',
                action: function () {
                    var selectedRows = params.api.getSelectedRows();
                    params.api.updateRowData({
                        remove: selectedRows
                    });
                },
            },
            'separator',
            {
                name: 'Pin selected rows',
                action: function () {
                    var MAX_PINNED_ROWS = 5;

                    var selectedRows = params.api.getSelectedRows().slice(0, MAX_PINNED_ROWS);
                    params.api.setPinnedTopRowData(selectedRows);
                },
            },
            {
                name: 'Clear pinned rows',
                action: function () { params.api.setPinnedTopRowData([]); },
            },
            'separator',
            'expandAll',
            'contractAll',
            'separator',
            {
                name: 'Pin column toggle',
                action: function () {
                    var currentCell = params.api.getFocusedCell();
                    if (currentCell) {
                        params.columnApi.setColumnPinned(currentCell.column, !currentCell.column.pinned);
                    }
                },
            },
            {
                name: 'Clear pinned columns',
                action: function () {
                    params.columnApi.setColumnsPinned(
                        params.columnApi.getAllColumns(),
                        null
                    );
                },
            },
            {
                name: 'Hide column',
                action: function () {
                    var currentCell = params.api.getFocusedCell();
                    if (currentCell) {
                        params.columnApi.setColumnVisible(currentCell.column, false);
                    }
                },
            },
            {
                name: 'Show all columns',
                action: function () {
                    params.columnApi.setColumnsVisible(
                        params.columnApi.getAllColumns(),
                        true
                    );
                },
            },
            'separator',
            {
                name: 'Add listener',
                action: function () {
                    // menuAddGlobalListener(state.mode, state.eventArr);
                },
            },
            {
                name: 'Remove listener',
                action: function () {
                    menuRemoveGlobalListener();
                },
                disabled: !state.globalListener
            },
            createEventMenus(state)
        ];
    }

    // ================================================ TOOL PANNEL ================================================
    // ================================================ TOOL PANNEL ================================================
    // ================================================ TOOL PANNEL ================================================
    // ================================================ TOOL PANNEL ================================================
    // ================================================ TOOL PANNEL ================================================

    function EventFilterToolPannel() { }
    EventFilterToolPannel.prototype = {
        init: function (params) {

        },
        getGui: function () { },
        refresh: function () { }
    };

    return {
        logGridInfo: logGridInfo,
        addGlobalListener: menuAddGlobalListener,
        removeGlobalListener: menuRemoveGlobalListener,
    };
};