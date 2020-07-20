import firebase from '../components/config/Firebase';

export const login = (email, password) => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((res) => console.log(res))
    .catch(() => false);
};

export const register = (email, password) => {
  return firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => true)
    .catch(() => false);
};
