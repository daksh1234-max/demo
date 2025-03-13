import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setError } from '@/store/slices/authSlice';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function LoginForm() {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {},
        'expired-callback': () => {},
      });
    }
  };

  const handlePhoneSignIn = async () => {
    try {
      setupRecaptcha();
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        phoneNumber,
        window.recaptchaVerifier
      );
      setVerificationId(verificationId);
      setIsVerifying(true);
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const verifyCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      <div className="space-y-4">
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Continue with Google
        </button>
        
        <button
          onClick={handleFacebookSignIn}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Continue with Facebook
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with phone</span>
          </div>
        </div>

        {!isVerifying ? (
          <>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div id="recaptcha-container"></div>
            <button
              onClick={handlePhoneSignIn}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Send verification code
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Verification code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={verifyCode}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Verify code
            </button>
          </>
        )}
      </div>
    </div>
  );
}
