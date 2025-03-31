import React, { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import axios from 'axios';

// Register a font for PDF
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
  ]
});

// PDF Styles based on template
const getStyles = (template) => {
  const baseStyles = {
    page: {
      padding: 30,
      fontFamily: 'Open Sans',
      fontSize: 12,
    },
    section: {
      marginBottom: 10,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    subheader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 20,
      borderBottom: '1 solid #000',
      paddingBottom: 5,
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
      lineHeight: 1.5,
    },
  };
  
  // Template-specific customizations
  switch(template) {
    case 'classic':
      return StyleSheet.create({
        ...baseStyles,
        header: {
          ...baseStyles.header,
          textTransform: 'uppercase',
          fontSize: 20,
        },
        subheader: {
          ...baseStyles.subheader,
          textTransform: 'uppercase',
          fontSize: 14,
          borderBottom: '1 solid #000',
        }
      });
    case 'creative':
      return StyleSheet.create({
        ...baseStyles,
        page: {
          ...baseStyles.page,
          padding: 40,
        },
        header: {
          ...baseStyles.header,
          color: '#4a6df0',
          fontSize: 26,
        },
        subheader: {
          ...baseStyles.subheader,
          color: '#4a6df0',
          borderBottom: '2 solid #4a6df0',
        }
      });
    case 'executive':
      return StyleSheet.create({
        ...baseStyles,
        page: {
          ...baseStyles.page,
          padding: 40,
          backgroundColor: '#f9f9f9',
        },
        header: {
          ...baseStyles.header,
          fontSize: 22,
        },
        subheader: {
          ...baseStyles.subheader,
          borderBottom: 'none',
          borderLeft: '4 solid #2c3e50',
          paddingLeft: 10,
        }
      });
    default: // modern
      return StyleSheet.create(baseStyles);
  }
};

// PDF Document Component
const ResumePDF = ({ resume }) => {
  // Default to modern template if resume or resume.template is undefined
  const template = resume?.template || 'modern';
  const styles = getStyles(template);
  
  // Add null check for resume.content
  if (!resume || !resume.content) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.text}>No resume content available.</Text>
          </View>
        </Page>
      </Document>
    );
  }
  
  // Simple conversion of markdown to structured PDF content
  // This is a simplified version; a full markdown parser would be more robust
  const formatContent = (content) => {
    const parts = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('# ')) {
        parts.push(<Text key={i} style={styles.header}>{line.substring(2)}</Text>);
      } else if (line.startsWith('## ')) {
        parts.push(<Text key={i} style={styles.subheader}>{line.substring(3)}</Text>);
      } else if (line.startsWith('- ')) {
        parts.push(<Text key={i} style={styles.text}>• {line.substring(2)}</Text>);
      } else if (line) {
        parts.push(<Text key={i} style={styles.text}>{line}</Text>);
      }
    }
    
    return parts;
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {formatContent(resume.content)}
        </View>
      </Page>
    </Document>
  );
};

// Export Options Component
const ExportOptions = ({ resume }) => {
  const [shareLink, setShareLink] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  
  // If resume is undefined, provide a fallback
  if (!resume) {
    return (
      <div className="export-options mt-4">
        <div className="alert alert-warning">
          No resume data available. Please generate a resume first.
        </div>
      </div>
    );
  }
  
  const generateShareLink = async () => {
    setIsSharing(true);
    try {
      // In a real app, this would call an API to store the resume and get a shareable link
      // For now, we'll simulate a delay and return a fake link
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShareLink(`${window.location.origin}/shared-resume/${Math.random().toString(36).substring(2, 10)}`);
    } catch (error) {
      console.error('Error generating share link:', error);
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <div className="export-options mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-light">
              <h4 className="mb-0">Export Your Resume</h4>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <PDFDownloadLink
                  document={<ResumePDF resume={resume} />}
                  fileName={`${resume?.sections?.header?.split('\n')[0] || 'resume'}.pdf`}
                  className="btn btn-primary"
                >
                  {({ loading }) => (
                    loading ? 'Preparing PDF...' : 'Download as PDF'
                  )}
                </PDFDownloadLink>
                
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => {
                    navigator.clipboard.writeText(resume.content);
                    alert('Resume content copied to clipboard!');
                  }}
                >
                  Copy as Markdown
                </button>
                
                <button 
                  className="btn btn-outline-info" 
                  onClick={generateShareLink}
                  disabled={isSharing}
                >
                  {isSharing ? 'Generating link...' : 'Generate Shareable Link'}
                </button>
                
                {shareLink && (
                  <div className="alert alert-success mt-3">
                    <p className="mb-2">Share this link with others:</p>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        value={shareLink} 
                        readOnly 
                      />
                      <button 
                        className="btn btn-outline-secondary" 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(shareLink);
                          alert('Link copied to clipboard!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;