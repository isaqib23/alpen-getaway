// `frontend/src/components/Layout.tsx`
import React, { useState, useEffect, ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import { useLoading } from '../context/LoadingContext';
import * as bookcarsTypes from "../types/bookcars-types";
import { strings } from '../lang/master';
import * as UserService from '../services/UserService';
import * as helper from '../common/helper';
import { useInit } from '../common/customHooks';
import { useAnalytics } from '../common/useAnalytics';

interface LayoutProps {
  user?: bookcarsTypes.User;
  strict?: boolean;
  hideSignin?: boolean;
  children: ReactNode;
  onLoad?: (user?: bookcarsTypes.User) => void;
}

const Layout: React.FC<LayoutProps> = ({
                                         user: masterUser,
                                         strict,
                                         hideSignin,
                                         children,
                                         onLoad,
                                       }) => {
  useAnalytics();
  const [user, setUser] = useState<bookcarsTypes.User>();
  const [loading, setLoading] = useState(true);
  const { isLoading, addLoadingTask, removeLoadingTask } = useLoading();

  useEffect(() => {
    if (masterUser && user && user.avatar !== masterUser.avatar) {
      setUser(masterUser);
    }
  }, [masterUser, user]);

  useInit(async () => {
    addLoadingTask('layout-auth'); // Add loading task for authentication
    
    const exit = async () => {
      if (strict) {
        await UserService.signout(false, true);
      } else {
        setLoading(false);
        removeLoadingTask('layout-auth'); // Remove loading task when done
        await UserService.signout(false, false);
        if (onLoad) {
          onLoad();
        }
      }
    };

    const currentUser = UserService.getCurrentUser();

    if (currentUser) {
      try {
        const status = await UserService.validateAccessToken();
        if (status === 200) {
          const _user = await UserService.getUser(currentUser._id);
          if (_user) {
            if (_user.blacklisted) {
              await exit();
              return;
            }
            setUser(_user);
            setLoading(false);
            removeLoadingTask('layout-auth'); // Remove loading task when user is loaded
            if (onLoad) {
              onLoad(_user);
            }
          } else {
            await exit();
          }
        } else {
          await exit();
        }
      } catch {
        await exit();
      }
    } else {
      await exit();
    }
  }, []);

  const handleResend = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    try {
      if (user) {
        const data = { email: user.email };
        const status = await UserService.resendLink(data);
        if (status === 200) {
          helper.info(strings.VALIDATION_EMAIL_SENT);
        } else {
          helper.error(null, strings.VALIDATION_EMAIL_ERROR);
        }
      }
    } catch (err) {
      helper.error(err, strings.VALIDATION_EMAIL_ERROR);
    }
  };

  return (
    <LoadingSpinner show={isLoading}>
      <Header user={user} hidden={loading} hideSignin={hideSignin} />
      {(!user && !loading) || (user && user.verified) ? (
          <>
            <div className="content">{children}</div>
            <Footer />
          </>
      ) : (
          !loading && (
              <div className="validate-email p-5">
                <div className="font-large">{strings.VALIDATE_EMAIL}</div>
                <button
                    type="button"
                    className="btn-default btn-resend mt-2"
                    onClick={handleResend}
                >
                  {strings.RESEND}
                </button>
              </div>
          )
      )}
    </LoadingSpinner>
  );
};

export default Layout;