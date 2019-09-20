export let ColumnData = [
  {
    headerName: 'Group cost center',
    field: 'k.0',
    type: ['string'],
    editable: true,
    cellEditor: 'editComp',
    cellEditorParams: {
      values: [
        { id: 1, name: '200001 - General Management' },
        { id: 2, name: '200002 - Management' },
        { id: 3, name: '200003 - DataCenter' },
        { id: 4, name: '200009 - Location Hamburg' },
        { id: 5, name: '200010 - General Management' },
        { id: 6, name: '200011 - Management' },
        { id: 7, name: '200012 - DataCenter' },
        { id: 8, name: '2000213 - Location Hamburg' }
      ]
    },
    aggFunc: null,
    rowGroup: false,
    pinned: 'left',
    sort: 'asc',
    sortedAt: -1
  }
];
