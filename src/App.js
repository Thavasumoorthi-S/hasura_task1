import './App.css';
import Todo from './component/Todo';
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


function App() {

  const httpLink = createHttpLink({
    uri: 'http://localhost:8080/v1/graphql', 
  });
  
  const authLink = setContext((_, { headers }) => {
    const hasuraAdminSecret = 'Welcome@ta';
  
    return {
      headers: {
        ...headers,
        'x-hasura-admin-secret': hasuraAdminSecret,
      },
    };
  });
  
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  


  return (
    <ApolloProvider client={client}>
      <Todo/>
    </ApolloProvider>  
    );
}

export default App;
