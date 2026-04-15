import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

/**
 * CertificatesSection Component
 * Display earned certificates with download and verification
 */
export const CertificatesSection = ({
  certificates = [],
  onDownloadClick = () => {},
  onVerifyClick = () => {},
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Certificates</h2>

      {certificates.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No certificates yet
          </h3>
          <p className="text-gray-600">
            Complete courses to earn certificates
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map(cert => (
            <Card key={cert.id} variant="elevated">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {cert.course_name || 'Course Certificate'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Earned on {new Date(cert.issued_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-4xl">🎓</div>
              </div>

              {/* Certificate Number */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-xs text-gray-600">Certificate Number</p>
                <p className="font-mono text-sm font-bold text-gray-800">
                  {cert.certificate_number}
                </p>
              </div>

              {/* QR Code Preview */}
              {cert.qr_code && (
                <div className="mb-4 flex justify-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <img
                      src={cert.qr_code}
                      alt="QR Code"
                      className="w-20 h-20"
                    />
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="mb-4">
                <Badge
                  label={cert.is_verified ? 'Verified' : 'Unverified'}
                  variant={cert.is_verified ? 'success' : 'warning'}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onDownloadClick(cert.id)}
                  fullWidth
                >
                  Download PDF
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onVerifyClick(cert.id)}
                  fullWidth
                >
                  Verify
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
