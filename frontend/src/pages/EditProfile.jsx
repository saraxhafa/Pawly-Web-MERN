
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { setUser } from "../store/slices/userSlice";

import {
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} from "../store/api/userApi";

import "../styles/App1.css";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);

  const [updateProfile, { isLoading }] =
    useUpdateProfileMutation();

  const [deleteProfile, { isLoading: isDeleting }] =
    useDeleteProfileMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPrivacyModal, setShowPrivacyModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  // REDIRECT IF NOT AUTHENTICATED
  useEffect(() => {
    if (!user?.token) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // SYNCHRONIZE USER DATA
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  // HANDLE FORM INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // VALIDATE PROFILE FORM
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Ju lutem vendosni emrin.");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Ju lutem vendosni email-in.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Ju lutem vendosni një email të vlefshëm.");
      return;
    }

    if (formData.password || formData.confirmPassword) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Fjalëkalimet nuk përputhen.");
        return;
      }

      if (formData.password.length < 8) {
        toast.error(
          "Fjalëkalimi duhet të ketë të paktën 8 karaktere."
        );
        return;
      }
    }

    setShowPrivacyModal(true);
  };

  // CONFIRM PROFILE UPDATE
  const confirmUpdate = async () => {
    if (!user?.token || isLoading || isDeleting) {
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.confirmPassword = formData.confirmPassword;
      }

      const updatedUser = await updateProfile(payload).unwrap();

      const updatedSession = {
        ...user,
        ...updatedUser,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedSession)
      );

      dispatch(setUser(updatedSession));

      setShowPrivacyModal(false);

      toast.success("Profili u përditësua me sukses!");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Ndodhi një gabim gjatë përditësimit."
      );
    }
  };

  // OPEN DELETE MODAL
  const openDeleteModal = () => {
    if (isLoading || isDeleting) {
      return;
    }

    setCurrentPassword("");
    setShowDeleteModal(true);
  };

  // CONFIRM PERMANENT PROFILE DELETION
  const confirmDelete = async () => {
    if (!user?.token || isDeleting || isLoading) {
      return;
    }

    if (!currentPassword.trim()) {
      toast.error("Ju lutem vendosni fjalëkalimin aktual.");
      return;
    }

    try {
      await deleteProfile({
        password: currentPassword,
      }).unwrap();

      // CLEAR LOCAL SESSION
      localStorage.removeItem("user");

      // CLEAR REDUX USER STATE
      dispatch(setUser(null));

      // RESET LOCAL FORM STATE
      setCurrentPassword("");
      setShowDeleteModal(false);
      setShowPrivacyModal(false);

      toast.success("Profili u fshi me sukses.");

      // REDIRECT TO LOGIN
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error?.data?.message ||
          "Ndodhi një gabim gjatë fshirjes së profilit."
      );
    }
  };

  return (
    <section className="edit-profile-page">
      <div className="edit-profile-container">

        {/* PAGE HEADING */}
        <div className="edit-profile-heading">
          <span className="profile-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>Redakto profilin</h1>

          <p>
            Përditëso të dhënat e llogarisë tënde Pawly.
          </p>
        </div>

        {/* PROFILE FORM */}
        <form
          onSubmit={handleSubmit}
          className="edit-profile-form"
        >
          <div className="profile-form-group">
            <label htmlFor="name">Emri i plotë</label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Vendos emrin"
              autoComplete="name"
              required
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Vendos email-in"
              autoComplete="email"
              required
            />
          </div>

          <div className="profile-form-divider">
            <span>Ndryshimi i fjalëkalimit</span>

            <p>
              Plotëso këto fusha vetëm nëse dëshiron të
              vendosësh një fjalëkalim të ri.
            </p>
          </div>

          <div className="profile-form-group">
            <label htmlFor="password">
              Fjalëkalimi i ri
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Fjalëkalimi i ri"
              autoComplete="new-password"
            />
          </div>

          <div className="profile-form-group">
            <label htmlFor="confirmPassword">
              Konfirmo fjalëkalimin
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Rishkruaj fjalëkalimin"
              autoComplete="new-password"
            />
          </div>

          {/* PROFILE ACTIONS */}
          <div className="profile-form-actions">
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={() => navigate("/dashboard")}
              disabled={isLoading || isDeleting}
            >
              Anulo
            </button>

            <button
              type="submit"
              className="profile-submit-btn"
              disabled={isLoading || isDeleting}
            >
              {isLoading
                ? "Duke përditësuar..."
                : "Redakto profilin"}
            </button>
          </div>
        </form>

        {/* DELETE PROFILE SECTION */}
        <div className="delete-profile-section">
          <div className="delete-profile-info">
            <h3>Fshirja e profilit</h3>

            <p>
              Nëse nuk dëshiron të përdorësh më llogarinë
              Pawly, mund ta fshish atë përgjithmonë.
              Ky veprim nuk mund të zhbëhet.
            </p>
          </div>

          <button
            type="button"
            className="delete-profile-btn"
            onClick={openDeleteModal}
            disabled={isLoading || isDeleting}
          >
            Fshi profilin
          </button>
        </div>
      </div>

      {/* PRIVACY MODAL - UPDATE PROFILE */}
      {showPrivacyModal && (
        <div
          className="privacy-modal-overlay"
          onClick={() => {
            if (!isLoading) {
              setShowPrivacyModal(false);
            }
          }}
        >
          <div
            className="privacy-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="privacy-modal-icon">
              <span>🔒</span>
            </div>

            <h2 id="privacy-title">
              Konfirmimi i ndryshimeve
            </h2>

            <p className="privacy-modal-intro">
              Përpara se të përditësosh profilin, lexo
              kushtet e mëposhtme të privatësisë:
            </p>

            <ul className="privacy-conditions">
              <li>
                Ndryshimet do të aplikohen vetëm në
                llogarinë aktuale.
              </li>

              <li>
                Fjalëkalimi i ri do të ruhet në formë
                hash-i dhe nuk do të ruhet si tekst i lexueshëm.
              </li>

              <li>
                Email-i duhet të jetë unik dhe i vlefshëm.
              </li>

              <li>
                Historiku i porosive nuk do të fshihet
                dhe porositë nuk do të transferohen në
                një llogari tjetër.
              </li>

              <li>
                Të dhënat e klientit ruhen në porosinë
                përkatëse sipas politikës së privatësisë.
              </li>
            </ul>

            <div className="privacy-modal-actions">
              <button
                type="button"
                className="privacy-cancel-btn"
                onClick={() => setShowPrivacyModal(false)}
                disabled={isLoading}
              >
                Kthehu
              </button>

              <button
                type="button"
                className="privacy-confirm-btn"
                onClick={confirmUpdate}
                disabled={isLoading}
              >
                {isLoading
                  ? "Duke përditësuar..."
                  : "Konfirmo ndryshimet"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE PROFILE MODAL */}
      {showDeleteModal && (
        <div
          className="privacy-modal-overlay"
          onClick={() => {
            if (!isDeleting) {
              setShowDeleteModal(false);
              setCurrentPassword("");
            }
          }}
        >
          <div
            className="privacy-modal delete-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-profile-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="privacy-modal-icon">
              <span>⚠️</span>
            </div>

            <h2 id="delete-profile-title">
              Fshirja e profilit
            </h2>

            <p className="privacy-modal-intro">
              A je i sigurt që dëshiron të fshish
              përgjithmonë profilin tënd Pawly?
            </p>

            <ul className="privacy-conditions">
              <li>
                Profili dhe të dhënat e llogarisë do të fshihen.
              </li>

              <li>
                Historiku i porosive do të ruhet, por emri
                dhe email-i në porositë e mëparshme do të
                anonimizohen.
              </li>

              <li>
                Pas fshirjes nuk do të mund të hysh më
                në këtë llogari.
              </li>

              <li>
                Ky veprim është i pakthyeshëm.
              </li>
            </ul>

            <div className="profile-form-group delete-password-group">
              <label htmlFor="currentPassword">
                Fjalëkalimi aktual
              </label>

              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Vendos fjalëkalimin aktual"
                autoComplete="current-password"
                disabled={isDeleting}
              />
            </div>

            <div className="privacy-modal-actions">
              <button
                type="button"
                className="privacy-cancel-btn"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentPassword("");
                }}
                disabled={isDeleting}
              >
                Anulo
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting
                  ? "Duke fshirë..."
                  : "Konfirmo fshirjen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default EditProfile;
