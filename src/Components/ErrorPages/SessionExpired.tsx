import * as Notification from "../../Utils/Notifications";
import { useNavigate } from "raviger";
import { useEffect } from "react";
import { handleSignOut } from "../../Utils/utils";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export default function SessionExpired() {
  const state: any = useSelector((state) => state);
  const { currentUser } = state;
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    Notification.closeAllNotifications();
  }, []);

  if ("data" in currentUser) {
    navigate("/");
  }

  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div className="w-[500px] text-center">
        <img
          src="/images/session_expired.svg"
          alt={t("session_expired")}
          className="w-full"
        />
        <h1>{t("session_expired")}</h1>
        <p>
          {t("session_expired_msg")}
          <br />
          <br />
          <div
            onClick={() => {
              handleSignOut(false);
            }}
            className="hover:bg-primary- inline-block cursor-pointer rounded-lg bg-primary-600 px-4 py-2 text-white hover:text-white"
          >
            {t("return_to_login")}
          </div>
        </p>
      </div>
    </div>
  );
}
