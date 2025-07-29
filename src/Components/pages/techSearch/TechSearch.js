import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FooterBar from "Components/common/footer";
import NavBar from "Components/common/navBar";
import TechSearchForm from 'Components/pages/techSearch/TechSearchForm';
import SectionOnePreview from 'Components/pages/techSearch/SectionOnePreview';
import SectionTwoPreview from 'Components/pages/techSearch/SectionTwoPreview';
import SectionThreePreview from 'Components/pages/techSearch/SectionThreePreview';
import SectionFourPreview from 'Components/pages/techSearch/SectionFourPreview';
import AllSectionPreview from 'Components/pages/techSearch/AllSectionPreview';

const TechSearch = () => {
  const initialValues = {
    industrialSector: "",
    labNo: "",
    themeNo: "",
    trnNo: "",
    sectionSelect: ""
  };

  const validationSchema = Yup.object({});

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValues, setSearchValues] = useState(initialValues);

  const handleSectionChange = (event) => {
    const { value } = event.target;
    setSelectedSection(value);
  };

  const handleSubmit = (values) => {
    setSearchValues(values);
    fetchData(values, 0); // reset to page 0
  };

  const fetchData = async (values, page = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://172.16.2.246:8080/apf/tdmp/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          theme: values.themeNo,
          industrialSector: values.industrialSector,
          lab: values.labNo,
          technologyRefNo: values.trnNo,
          page,
          size: 5,
        }),
      });

      const result = await response.json();
      setData(result);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex">
        <div className="bg-gray-800"></div>
        <div className="flex-1 p-8 bg-blue-200 border">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <TechSearchForm
                selectedSection={selectedSection}
                handleSectionChange={handleSectionChange}
              />
            </Form>
          </Formik>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              {!selectedSection && data.sectionOneList && (
                <AllSectionPreview
                  data={data}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => fetchData(searchValues, page)}
                />
              )}

              {selectedSection === 'SectionOne' && data.sectionOneList && (
                <SectionOnePreview data={data} />
              )}
              {selectedSection === 'SectionTwo' && data.sectionTwoList && (
                <SectionTwoPreview data={data} />
              )}
              {selectedSection === 'SectionThree' && data.sectionThreeList && (
                <SectionThreePreview data={data} />
              )}
              {selectedSection === 'SectionFour' && data.sectionFourList && (
                <SectionFourPreview data={data} />
              )}
            </>
          )}
        </div>
      </div>
      <FooterBar />
    </>
  );
};

export default TechSearch;
