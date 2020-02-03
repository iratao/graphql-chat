import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import logo from './logo.svg';
import './App.css';


class App extends React.Component {
  state = {
    from: {
      id: 'ck63meqagof2i0b00nah7x8k2',
      name: 'Heisenberg'
    },
    content: ''
  };

  _subscribeToNewChats = () => {
    this.props.allChatsQuery.subscribeToMore({
        document: gql`
          subscription {
            newChat() {
              node {
                id
                from {
                  id
                  name
                }
                content
                createdAt
              }
            }
          }
        `,
        updateQuery: (previous, { subscriptionData }) => {
          const newChats = [
            ...previous.chats,
            subscriptionData.data.newChat.node
          ];
          const result = {
            ...previous,
            chats: newChats
          };
          return result;
        }
      });
    };

  componentDidMount() {

  }

  render() {
    const allChats = this.props.allChatsQuery.chats || [];
    return (
      <div className="App">
        <div>
          {allChats.map(chat => <p>{JSON.stringify(chat)}</p>)}
        </div>
      </div>
    );
  }
}

const ALL_CHATS_QUERY = gql`
  query AllChatsQuery {
    chats {
      id
      createdAt
      from {
        id
        name
      }
      content
    }
  }
`;

export default graphql(ALL_CHATS_QUERY, { name: 'allChatsQuery' })(App);
