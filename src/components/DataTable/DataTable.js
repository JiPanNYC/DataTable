import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'; //prepare for potential react Links in the future

/*pinyin is for Chinese Characters Sorting*/
const pinyin = require("pinyin");
const SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

/*Build the Header Class*/
class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);
    this._onSortChange = this._onSortChange.bind(this);
  }

  _onSortChange(e) {
    e.preventDefault();
    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ? this.reverseSortDirection(this.props.sortDir) : SortTypes.DESC
      );
    }
  }

  reverseSortDirection(sortDir) {
    return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
  }

  render() {
    const {sortDir, children, ...props} = this.props;

    return (
      <th {...props}>
        <a onClick={this._onSortChange}>
          {children} 
        </a>
      </th>
    );
  }
}

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
          DataList: this.props.dataToDataTable.cellContents,
          colSortDirs: {},
      };
    this.sortData = this.sortData.bind(this);
    this.handleFilterStringChange = this.handleFilterStringChange.bind(this);
  }

  handleFilterStringChange (e) {
    const {dataToDataTable} = this.props;
    if (!e.target.value) {
      this.setState({
        DataList: dataToDataTable.cellContents,
      });
    }
    const filteredData = this.filterData(e.target.value)
    this.setState({
        DataList: filteredData,
    });
  }

  doesMatch (str) {
    return (key) => (key + '').toLowerCase().indexOf(str) !== -1;
  }

  filterData (filterString) {
    const {dataToDataTable} = this.props;
    let str = '';
    if (filterString) { str = filterString.toLowerCase();}
    return str !== ''
      ? dataToDataTable.cellContents.filter((r) => Object.values(r).some(this.doesMatch(str)))
      : dataToDataTable.cellContents;
  }

  sortData (columnKey, sortDir) {
    const {DataList, colSortDirs} = this.state;
    DataList.sort((indexA, indexB) => {
      let valueA = indexA[String(columnKey)];
      let valueB = indexB[String(columnKey)];
      if (typeof valueA == 'string' && typeof valueB == 'string') {
        return pinyin.compare(valueA, valueB);
      }
      let sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      return sortVal;
    });
    if (sortDir === SortTypes.DESC) {
      DataList.reverse();
    }
    const NewColSortDirs = Object.assign({}, colSortDirs, {
          [columnKey]: sortDir,
          });
    this.setState({
        DataList: DataList,
        colSortDirs: NewColSortDirs,
    });
  }

  createHeader (headers, colSortDirs) {
    const cellHeaderComponent = [];
    for (let keyid = 0; keyid < headers.length; keyid++) {
        cellHeaderComponent.push(<SortHeaderCell
          columnKey = {headers[keyid]}
          onSortChange={this.sortData}
          sortDir= {colSortDirs[headers[keyid]]} children={headers[keyid]} />);
    }
    return cellHeaderComponent;
  }

  createCells (DataList) {
    const cellComponent = [];
    for (let rowid = 0; rowid < DataList.length; rowid++) {
      const secondlevelCellComponent = [];
      for (let keyid = 0; keyid < headers.length; keyid++) {
        secondlevelCellComponent.push(<td className={"TableCol" + keyid + " " + headers[keyid]}>{DataList[rowid][headers[keyid]]}</td>);
      }
      cellComponent.push(<tr>{secondlevelCellComponent}</tr>);
    }
    return cellComponent;
  }

  render() {
    const { dataToDataTable, tableCategory } = this.props;
    const {DataList, colSortDirs} = this.state;
    const headers = dataToDataTable.cellHeaderFooterContents;
    const cellHeaderComponent = this.createHeader(headers, colSortDirs);
    const cellComponent = this.createCells(DataList);

    return (
      <div className="data_table_wrapper">
        <div className="data_table_filter_row">
          <span>{tableCategory}</span>
          <input className='filter-input'
                  onChange={this.handleFilterStringChange}
                  type='text' placeholder='Filter Rows'
                  autoCorrect='off' autoCapitalize='off' spellCheck='false' />
        </div>
        <table className={"data_table display " + dataToDataTable.layout} cellSpacing="0">
          <thead>
            <tr>
                {cellHeaderComponent}
              </tr>
          </thead>
          <tbody>
              {cellComponent}
          </tbody>
        </table>
      </div>
    );
  }
}


