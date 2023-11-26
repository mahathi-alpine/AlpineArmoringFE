import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={`${styles.footer}`}>
      <div className={`${styles.footer_wrapper}`}>
        <div className={`${styles.footer_top}`}>
          <h2 className={`${styles.footer_top_heading}`}>Alpine Armoring</h2>
          <h3 className={`${styles.footer_top_subeading}`}>"no one protects you better" ®</h3>
        </div>

        <div className="footer_middle">
          <div className="footer_middle_info">
            <div>
              <h3 className="footer_title">Contact</h3>
              <ul className="footer_contact_list">
                <li>
                  <img src="" alt="" />
                  1.703.471.0002
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;