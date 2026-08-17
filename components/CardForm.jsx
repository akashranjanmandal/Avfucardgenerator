'use client';

import styles from './CardForm.module.css';
import { IconIdCard, IconFlip } from './Icons';
import { ROLES } from '@/lib/cardConstants';

export default function CardForm({
  values,
  onChange,
  onPhotoChange,
  onSignatureChange,
  onSubmit,
  onReset,
  saving,
  submitLabel,
  cardNo,
}) {
  function handleInput(e) {
    onChange(e.target.name, e.target.value);
  }

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <p className={styles.cardNo}>
        <IconIdCard size={15} />
        Card No. {cardNo ? `#${cardNo}` : '— assigned automatically on save'}
      </p>

      <label className={styles.roleField}>
        Role
        <span className={styles.roleSelectWrap}>
          <span
            className={styles.roleSwatch}
            style={{
              background: ROLES.find((r) => r.value === values.role)?.borderColor || '#cbd2dc',
            }}
          />
          <select name="role" value={values.role} onChange={handleInput} required>
            <option value="" disabled>
              Select role…
            </option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.value}
              </option>
            ))}
          </select>
        </span>
        <span className={styles.roleHint}>
          Sets the card&apos;s border color. Registrar cards are signed by the Vice
          Chancellor; every other role is signed by the Registrar.
        </span>
      </label>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <IconIdCard size={15} />
          <span>Front side</span>
        </div>

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

        <div className={styles.fieldRow}>
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
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <IconFlip size={15} />
          <span>Back side</span>
        </div>

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

        <div className={styles.fieldRow}>
          <label>
            Date of Birth
            <input name="dob" placeholder="20-01-1963" value={values.dob} onChange={handleInput} />
          </label>

          <label>
            Blood Group
            <input
              name="bloodGroup"
              placeholder="A+ve"
              value={values.bloodGroup}
              onChange={handleInput}
            />
          </label>
        </div>

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

        <div className={styles.fieldRow}>
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
        </div>
      </div>

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
