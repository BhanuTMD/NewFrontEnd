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
    const validationSchema = Yup.object({
        // Validation schema
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSection, setSelectedSection] = useState('');

    const handleSectionChange = (event) => {
        const { value } = event.target;
        setSelectedSection(value);
    };

    const handleSubmit = (values) => {
        console.log("Submitted Data:", values);
        fetchData(values);
    };

    const fetchData = async (values) => {
        setLoading(true);
        try {
            // ✅ Token localStorage se lo
            const token = localStorage.getItem('token');
            console.log("Using token:", token);

            const response = await fetch('http://172.16.2.246:8080/apf/tdmp/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // ✅ Token bhejo Authorization header mein
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    theme: values.themeNo,
                    industrialSector: values.industrialSector,
                    lab: values.labNo,
                    technologyRefNo: values.trnNo,
                    page: 0,
                    size: 10,
                }),
            });
            const result = await response.json();
            console.log("Fetched Data:", result);
            setData(result);
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
                    {(loading && <div className="text-center py-8">Loading...</div>) || (
                        <>
                            {!selectedSection && data.sectionOneList && (
                                <AllSectionPreview data={data} />
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