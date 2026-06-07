const [showDeleteModal, setShowDeleteModal] = useState(false);

const [confirmText, setConfirmText] = useState("");

{
  showDeleteModal && (
    <div className="modal">
      <div className="modal-content">
        <h2>Delete Account</h2>

        <p>
          Type DELETE to confirm.
        </p>

        <label htmlFor="deleteConfirm">
  Type DELETE to confirm
</label>

<input
  id="deleteConfirm"
  type="text"
  value={confirmText}
  placeholder="DELETE"
  onChange={(e) =>
    setConfirmText(e.target.value)
  }
/>

        <button
          disabled={confirmText !== "DELETE"}
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}