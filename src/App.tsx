import { lazy, Suspense, FC } from 'react';
import { useAuth } from '@altrx/gundb-react-auth';
const AuthenticatedApp = lazy(
  () => import(/* webpackPrefetch: true */ './AuthenticatedApp')
);
const UnauthenticatedApp = lazy(() => import('./UnauthenticatedApp'));

const App: FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <section>
      <Suspense fallback={<p>loading...</p>}>
        {isLoggedIn ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </Suspense>
    </section>
  );
};

export default App;
