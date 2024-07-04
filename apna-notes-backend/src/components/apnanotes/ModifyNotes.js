import React, { useContext } from 'react';
import FetchData from './FetchData';
import { useParams } from 'react-router-dom';
import { AuthContext } from './security/AuthContext';

function ModifyNotes() {
    const {user}  = useParams()
    const {username} = useContext(AuthContext)

    return (
      <div>
        <FetchData userSpecific={user === username} username={user}></FetchData>
      </div>
    )
  }
  
export default ModifyNotes
