'use client';

import styles from './CardForm.module.css';

export default function CardForm({
  values,
  onChange,
  onPhotoChange,
  onSignatureChange,
  onSubmit,
  onReset,
  saving,
  submitLabel,
}) {
  function handleInput(e) {
    onChange(e.target.name, e.target.value);
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <fieldset>
        <legend>Front side</legend>

        <label>
          ID No.
          <input name="idNo" value={values.idNo} onChange={handleInput} required />
        </label>

        <label>
          Name
          <input name="name" value={values.name} onChange={handleInput} required />
        </label>

        <label>
          Designation
          <input name="designation" value={values.designation} onChange={handleInput} required />
        </label>

        <label>
          Office/Deptt
          <textarea name="officeDept" value={values.officeDept} onChange={handleInput} rows={3} />
        </label>

        <label>
          Photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onPhotoChange(e.target.files?.[0] || null)}
          />
        </label>

        <label>
          Holder&apos;s Signature
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onSignatureChange(e.target.files?.[0] || null)}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Back side</legend>

        <label>
          Home Address
          <textarea
            name="homeAddress"
            value={values.homeAddress}
            onChange={handleInput}
            rows={4}
            required
          />
        </label>

        <label>
          Date of Birth
          <input name="dob" placeholder="20-01-1963" value={values.dob} onChange={handleInput} />
        </label>

        <label>
          Blood Group
          <input name="bloodGroup" placeholder="A+ve" value={values.bloodGroup} onChange={handleInput} />
        </label>

        <label>
          Mobile No.
          <input name="mobile" value={values.mobile} onChange={handleInput} />
        </label>

        <label>
          Email
          <input type="email" name="email" value={values.email} onChange={handleInput} />
        </label>

        <label>
          Identification Mark
          <input
            name="identificationMark"
            value={values.identificationMark}
            onChange={handleInput}
          />
        </label>

        <label>
          Date of Issue
          <input
            name="dateOfIssue"
            placeholder="20.01.2026"
            value={values.dateOfIssue}
            onChange={handleInput}
          />
        </label>

        <label>
          Valid Upto
          <input
            name="validUpto"
            placeholder="31.01.2028"
            value={values.validUpto}
            onChange={handleInput}
          />
        </label>
      </fieldset>

      <div className={styles.actions}>
        <button type="submit" disabled={saving}>
          {saving ? 'Working…' : submitLabel}
        </button>
        {onReset && (
          <button type="button" onClick={onReset} disabled={saving}>
            Reset
          </button>
        )}
      </div>
    </form>
  );
}
