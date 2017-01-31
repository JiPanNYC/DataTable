import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchIndividualCategory } from '../../actions/Category/actions';
import { isLoaded } from 'redux/modules/category';
import { asyncConnect } from 'redux-async-connect';
import { Col, Tabs, Tab, Row } from 'react-bootstrap';
import {BootsTab, DataTable} from 'components';


@asyncConnect([{
  promise: ({store: {dispatch, getState}, params: { categoryId }, }) => {
    const promises = [];
    if (!isLoaded(getState(), categoryId)) {  
      promises.push(dispatch(fetchIndividualCategory(categoryId)));
    }
    return Promise.all(promises);
  }
}])

@connect(
  (state, ownProps) => ({
    dataTableInCategory: state.category.dataTableInCategory,
  })
)

export default class ParentCategoryPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { dataTableInCategory } = this.props;
    const tableLength = dataTableInCategory.length;
    const dataTable = tableLength === 0 ? [] : dataTableInCategory;
    const tabContents = (table) => table.map((sheet, index) => {return {'title': sheet.title, 'content': <DataTable dataToDataTable = { sheet } key = { index }/>}});
    
    return (
      <Col className="container">
        <div className="row category-row clearfix">
          <Col className="datatable" xs={12} md={12}>
            <div className = "references">
                Data is retrieved from <a href = 'http://data.worldbank.org/data-catalog/GDP-ranking-table'><u>http://data.worldbank.org/data-catalog/GDP-ranking-table</u></a> and <a href = 'http://data.worldbank.org/data-catalog/Population-ranking-table'><u>http://data.worldbank.org/data-catalog/Population-ranking-table</u></a>
            </div>
            <BootsTab TabContents = {tabContents(dataTable)} />
          </Col>
        </div>
      </Col>
    );
  }
}
