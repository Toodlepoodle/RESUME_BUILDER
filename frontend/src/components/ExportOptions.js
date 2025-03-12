import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

// PDF Document Component
const ResumePDF = ({ resume }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Resume</Text>
        <Text style={styles.text}>{resume.content}</Text>
      </View>
    </Page>
  </Document>
);

// Export Options Component
const ExportOptions = ({ resume }) => {
  return (
    <div className="export-options mt-4">
      <PDFDownloadLink
        document={<ResumePDF resume={resume} />}
        fileName="resume.pdf"
      >
        {({ loading }) => (
          <button className="btn btn-primary me-2">
            {loading ? 'Generating PDF...' : 'Export as PDF'}
          </button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default ExportOptions;