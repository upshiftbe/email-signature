import type { TrimmedValues } from '../types';
import { RAW_ASSET_BASE } from '../config/formConfig';
import { sanitizeUrl, sanitizePhone, sanitizeEmail, escapeHtml } from '../lib/security';

type EmailSignatureProps = {
  values: TrimmedValues;
};

export function EmailSignature({ values }: EmailSignatureProps) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: 24,
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: 12,
        lineHeight: 1.4,
        color: '#181127',
      }}
    >
      <table
        cellPadding={0}
        cellSpacing={0}
        style={{
          width: '100%',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          borderCollapse: 'collapse',
        }}
      >
        <tbody>
          <tr>
            <td>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'middle' }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 17,
                          fontWeight: 500,
                          color: '#181127',
                        }}
                      >
                        <span id="footer-naam">{escapeHtml(values.name)}</span>
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          lineHeight: '22px',
                          color: '#181127',
                        }}
                      >
                        <span id="footer-functie">{escapeHtml(values.role)}</span>
                      </p>
                    </td>
                    <td
                      style={{
                        verticalAlign: 'middle',
                        borderLeft: '1px solid #283e89',
                        paddingLeft: 16,
                      }}
                    >
                      <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                        <tbody>
                          <tr
                            style={{
                              verticalAlign: 'middle',
                              height: 25,
                            }}
                          >
                            <td
                              width={30}
                              style={{
                                verticalAlign: 'middle',
                              }}
                            >
                              <img
                                src={`${RAW_ASSET_BASE}/phone.png`}
                                width={20}
                                height={20}
                                alt="Phone"
                                style={{ display: 'block' }}
                              />
                            </td>
                            <td
                              style={{
                                verticalAlign: 'middle',
                                fontSize: 12,
                              }}
                            >
                              <a
                                id="link-gsm"
                                href={values.phone ? `tel:${sanitizePhone(values.phone)}` : ''}
                                style={{
                                  textDecoration: 'none',
                                  color: '#181127',
                                }}
                              >
                                <span id="footer-gsm">{escapeHtml(values.phone)}</span>
                              </a>
                            </td>
                          </tr>
                          <tr
                            style={{
                              verticalAlign: 'middle',
                              height: 25,
                            }}
                          >
                            <td
                              width={30}
                              style={{
                                verticalAlign: 'middle',
                              }}
                            >
                              <img
                                src={`${RAW_ASSET_BASE}/mail.png`}
                                width={20}
                                height={20}
                                alt="Email"
                                style={{ display: 'block' }}
                              />
                            </td>
                            <td
                              style={{
                                verticalAlign: 'middle',
                                fontSize: 12,
                              }}
                            >
                              <a
                                id="link-email"
                                href={values.email ? `mailto:${sanitizeEmail(values.email)}` : ''}
                                style={{
                                  textDecoration: 'none',
                                  color: '#181127',
                                }}
                              >
                                <span id="footer-email">{escapeHtml(values.email)}</span>
                              </a>
                            </td>
                          </tr>
                          {values.websiteUrl && (
                            <tr
                              style={{
                                verticalAlign: 'middle',
                                height: 25,
                              }}
                            >
                              <td
                                width={30}
                                style={{
                                  verticalAlign: 'middle',
                                }}
                              >
                                <img
                                  src={`${RAW_ASSET_BASE}/globe.png`}
                                  width={20}
                                  height={20}
                                  alt="Website"
                                  style={{ display: 'block' }}
                                />
                              </td>
                              <td
                                style={{
                                  verticalAlign: 'middle',
                                  fontSize: 12,
                                }}
                              >
                                <a
                                  id="link-website"
                                  href={sanitizeUrl(values.websiteUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: 'none',
                                    color: '#181127',
                                  }}
                                >
                                  <span id="footer-website">
                                    {escapeHtml(values.websiteLabel || values.websiteUrl)}
                                  </span>
                                </a>
                              </td>
                            </tr>
                          )}
                          <tr
                            style={{
                              verticalAlign: 'middle',
                              height: 25,
                            }}
                          >
                            <td
                              width={30}
                              style={{
                                verticalAlign: 'middle',
                              }}
                            >
                              <img
                                src={`${RAW_ASSET_BASE}/building.png`}
                                width={20}
                                height={20}
                                alt="Location"
                                style={{ display: 'block' }}
                              />
                            </td>
                            <td
                              style={{
                                verticalAlign: 'middle',
                                fontSize: 12,
                              }}
                            >
                              <span id="footer-locatie-1">{escapeHtml(values.location1)}</span>
                            </td>
                          </tr>
                          {values.location2 && (
                            <tr
                              id="footer-locatie-2-container"
                              style={{
                                verticalAlign: 'middle',
                                height: 25,
                              }}
                            >
                              <td
                                width={30}
                                style={{
                                  verticalAlign: 'middle',
                                }}
                              />
                              <td
                                style={{
                                  verticalAlign: 'middle',
                                  fontSize: 12,
                                }}
                              >
                                <span id="footer-locatie-2">{escapeHtml(values.location2)}</span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%', marginTop: 5 }}>
                <tbody>
                  <tr>
                    <td>
                      <a href="https://upshift.be" target="_blank" rel="noreferrer">
                        <img
                          src={`${RAW_ASSET_BASE}/upshift_logo.png`}
                          width={100}
                          alt="Upshift"
                          style={{
                            maxHeight: 50,
                            width: 'auto',
                            display: 'block',
                          }}
                        />
                      </a>
                    </td>
                    <td
                      style={{
                        paddingBottom: 2,
                        textAlign: 'right',
                      }}
                    >
                      <table
                        cellPadding={0}
                        cellSpacing={0}
                        style={{
                          marginLeft: 'auto',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <tbody>
                          <tr>
                            {[
                              {
                                id: 'facebook',
                                icon: 'facebook.png',
                                href: values.facebook,
                              },
                              {
                                id: 'linkedin',
                                icon: 'linkedin.png',
                                href: values.linkedin,
                              },
                              {
                                id: 'instagram',
                                icon: 'instagram.png',
                                href: values.instagram,
                              },
                            ]
                              .map((social) => ({
                                ...social,
                                href: sanitizeUrl(social.href),
                              }))
                              .filter((social) => social.href)
                              .map((social) => (
                                <td key={social.id}>
                                  <a
                                    id={`link-${social.id}`}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-block',
                                      padding: 0,
                                      color: '#181127',
                                    }}
                                  >
                                    <img
                                      src={`${RAW_ASSET_BASE}/${social.icon}`}
                                      width={20}
                                      height={20}
                                      alt={social.id}
                                      style={{
                                        display: 'block',
                                      }}
                                    />
                                  </a>
                                </td>
                              ))}
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table cellPadding={0} cellSpacing={0} style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td height={5} />
                  </tr>
                  <tr>
                    <td
                      style={{
                        width: '100%',
                        borderBottom: '1px solid #283e89',
                        display: 'block',
                      }}
                    />
                  </tr>
                  <tr>
                    <td height={5} />
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
