import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/authContext';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPassRef = useRef();
  const authContext = useContext(AuthContext);
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredNewPassRef = newPassRef.current.value;
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBrwIb5B11iL-nVclB-0ctdCEXfgfZTBbM',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: authContext.token,
          password: enteredNewPassRef,
          returnSecureToken: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    ).then((res) => {
      console.log(res);
      history.replace('/');
    });
  };
  return (
    <>
      {
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.control}>
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              minLength={7}
              ref={newPassRef}
            />
          </div>
          <div className={classes.action}>
            <button>Change Password</button>
          </div>
        </form>
      }
    </>
  );
};

export default ProfileForm;
