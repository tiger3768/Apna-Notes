import React from 'react';
import FetchData from './FetchData';

function Home() {
  return (
    <div>
      <FetchData userSpecific={false}></FetchData>
    </div>
  );
}

export default Home;
