import {createButton} from "react-social-login-buttons";
 
const config = {
  text: "Sign Up with Google",
  icon: "google",
  iconFormat: name => `fab fa-${name}`,
  style: { background: "#cb3f22" },
  activeStyle: { background: "#a5331c" }
};

const MyGoogleSignUpButton = createButton(config);
 
export default MyGoogleSignUpButton;