import React from 'react';
import { ActivityIndicator } from 'react-native';

import { List, ListItem } from '../components/List';
import { geoFetch } from '../util/api';

class ListScreen extends React.Component {
  state = {
    loading: true,
    list: [],
    refreshing: false,
  };

  componentDidMount() {
    geoFetch('/geocache/list')
      .then(response => {
        //  console.log('response', response)
        this.setState({
          loading: false,
          refreshing: false,
          list: response.result,
        });
      })
      .catch(error => {
        console.log('list error', error);
      });
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      seed: this.state.seed + 1,
    }, () => {
      geoFetch('/geocache/list')
        .then(response => {
          this.setState({
            loading: false,
            refreshing: false,
            list: response.result,
          });
        })
        .catch(error => {
          console.log('list error', error);
        });
      // geoFetch(`/geocache/list/?seed=${this.state.seed}`);
    });
  }

  render() {
    if (this.state.loading || this.state.refreshing) {
      return <ActivityIndicator size="large" />;
    }

    return (
      <List
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        data={this.state.list}
        renderItem={({ item, index }) => (
          <ListItem
            title={item.title}
            isOdd={index % 2}
            onPress={() => this.props.navigation.navigate('Details', { item })}
          />
        )}
      />
    );
  }
}

export default ListScreen;