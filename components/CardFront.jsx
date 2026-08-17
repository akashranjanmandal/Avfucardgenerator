'use client';

import { forwardRef } from 'react';
import styles from './CardFront.module.css';
import Watermark from './Watermark';
import { VC_SIGNATURE_LINE_1, VC_SIGNATURE_LINE_2 } from '@/lib/cardConstants';

const CardFront = forwardRef(function CardFront(
  { idNo, name, designation, officeDept, photoUrl, signatureUrl },
  ref
) {
  return (
    <div className={styles.card} ref={ref}>
      <Watermark />

      <div className={styles.idNo}>ID No. : {idNo}</div>

      <div className={styles.header}>
        <div className={styles.uniName}>ASSAM VETERINARY AND FISHERY UNIVERSITY</div>
        <div className={styles.uniAddr}>KHANAPARA, GUWAHATI, ASSAM, INDIA</div>
      </div>

      <div className={styles.title}>IDENTITY CARD</div>

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
          <div className={styles.vcLine1}>{VC_SIGNATURE_LINE_1}</div>
          <div className={styles.vcLine2}>{VC_SIGNATURE_LINE_2}</div>
        </div>
      </div>
    </div>
  );
});

export default CardFront;
