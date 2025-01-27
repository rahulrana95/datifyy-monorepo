import React from "react";


const SignUp: React.FC = () => {
    return (
        <div className="container">
            <div className="card">
                {/* Left Section */}
                <div className="left-section">
                    <div className="back-button">
                        <button className="back-arrow">&#8592;</button>
                    </div>
                    <h2>Create Account</h2>
                    <p className="subtitle">Join our community and start your journey.</p>
                    <div className="social-buttons">
                        <button className="social-button">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                                alt="Google"
                                className="social-icon"
                            />
                            Google
                        </button>
                        <button className="social-button">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                                alt="Apple"
                                className="social-icon"
                            />
                            Apple
                        </button>
                    </div>
                    <p className="divider">or continue with email</p>
                    <form>
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe" className="input" />

                        <label>Email Address</label>
                        <input type="email" placeholder="john@example.com" className="input" />

                        <label>Password</label>
                        <input type="password" placeholder="********" className="input" />

                        <div className="checkbox-wrapper">
                            <input type="checkbox" className="checkbox" />
                            <label>
                                I agree to the{" "}
                                <a href="#" className="link">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="link">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>

                        <button className="submit-button">Create Account</button>
                    </form>
                    <p className="signin">
                        Already have an account?{" "}
                        <a href="#" className="link">
                            Sign in
                        </a>
                    </p>
                </div>

                {/* Right Section */}
                <div className="right-section">
                    <h2>Start your journey with us</h2>
                    <p>
                        Join thousands of users who trust our platform for their daily needs.
                        Experience seamless connectivity and endless possibilities.
                    </p>
                    <div className="icon-circle">
                        <span>&#10003;</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
