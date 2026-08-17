'use client';

import { forwardRef } from 'react';
import styles from './CardBack.module.css';
import Watermark from './Watermark';
import { getRoleBorderColor } from '@/lib/cardConstants';

const CardBack = forwardRef(function CardBack(
  { homeAddress, dob, bloodGroup, mobile, email, identificationMark, dateOfIssue, validUpto, role },
  ref
) {
  const borderColor = getRoleBorderColor(role);

  return (
    <div className={styles.card} ref={ref} style={{ '--card-border': borderColor }}>
      <Watermark />

      <div className={styles.leftBlock}>
        <div className={styles.addrLabel}>Home Address :</div>
        <div className={styles.addrValue}>{homeAddress}</div>

        <div className={styles.row}>
          <span className={styles.label}>Date of Birth :</span>
          <span className={styles.value}>{dob}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Blood Group :</span>
          <span className={styles.value}>{bloodGroup}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Mobile No. :</span>
          <span className={styles.value}>{mobile}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Email :</span>
          <span className={styles.value}>{email}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Identification Mark :</span>
          <span className={styles.value}>{identificationMark}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Date of Issue :</span>
          <span className={styles.value}>{dateOfIssue}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>This card is valid upto :</span>
          <span className={styles.value}>{validUpto}</span>
        </div>
      </div>

      <div className={styles.returnBox}>
        <div className={styles.registrarHeader}>IF FOUND, RETURN TO</div>
        <div className={styles.returnBody}>
          <div>If this card is found missing, please return the card in the following address:</div>
          <div className={styles.returnSpacer} />
          <div className={styles.registrarBold}>REGISTRAR</div>
          <div>Assam Veterinary and</div>
          <div>Fishery University</div>
          <div>Khanapara, Guwahati,</div>
          <div>Assam, India</div>
          <div>PIN-781022</div>
          <div className={styles.returnSpacer} />
          <div>Tel : +91-361-2910063</div>
        </div>
      </div>
    </div>
  );
});

export default CardBack;
