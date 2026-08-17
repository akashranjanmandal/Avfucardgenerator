'use client';

import { forwardRef } from 'react';
import styles from './CardFront.module.css';
import Watermark from './Watermark';
import { SIGNATORY_LINE_2, getSignatoryLine1, getRoleBorderColor } from '@/lib/cardConstants';

const CardFront = forwardRef(function CardFront(
  { idNo, name, designation, officeDept, role, photoUrl, signatureUrl },
  ref
) {
  const borderColor = getRoleBorderColor(role);

  return (
    <div className={styles.card} ref={ref} style={{ '--card-border': borderColor }}>
      <Watermark />

      <div className={styles.topBar}>
        <div className={styles.idNo}>ID No. : {idNo}</div>
        <div className={styles.header}>
          <div className={styles.uniName}>ASSAM VETERINARY AND FISHERY UNIVERSITY</div>
          <div className={styles.uniAddr}>KHANAPARA, GUWAHATI, ASSAM, INDIA</div>
        </div>
      </div>

      <div className={styles.title}>IDENTITY CARD</div>
      <div className={styles.titleRule} />

      <div className={styles.photoBox}>
        {photoUrl ? (
          <img src={photoUrl} alt="" className={styles.photoImg} />
        ) : (
          <div className={styles.photoPlaceholder}>Photo</div>
        )}
      </div>

      <div className={styles.infoBlock}>
        <div className={styles.row}>
          <span className={styles.label}>Name :</span>
          <span className={styles.value}>{name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Designation :</span>
          <span className={styles.value}>{designation}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Office/Deptt :</span>
          <span className={styles.value}>{officeDept}</span>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <div className={styles.signatureBlock}>
          {signatureUrl ? (
            <img src={signatureUrl} alt="" className={styles.signatureImg} />
          ) : (
            <div className={styles.signaturePlaceholder} />
          )}
          <div className={styles.signatureCaption}>Holder&apos;s Signature</div>
        </div>

        <div className={styles.vcBlock}>
          <div className={styles.vcBlank} />
          <div className={styles.vcLine1}>{getSignatoryLine1(role)}</div>
          <div className={styles.vcLine2}>{SIGNATORY_LINE_2}</div>
        </div>
      </div>
    </div>
  );
});

export default CardFront;
