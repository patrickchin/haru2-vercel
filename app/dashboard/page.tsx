import { auth, signOut } from 'app/auth';
import Header from '../components/header';

export default function ProtectedPage() {
  return (
    <div className="flex flex-col w-screen h-screen bg-gray-50">
      {/* <Header currentHref={window.location.href}/> */}
      <Header currentHref="/dashboard"/>
      <main className="w-screen flex">
        <section>
          <h1>organise</h1>
          <p>loreum ipsum</p>
        </section>
      </main>
    </div>
  );
}
