import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, PDFDownloadLink } from '@react-pdf/renderer';

const Reports = () => {
    const [equipmentData, setEquipmentData] = useState([]);
    const [repairRecords, setRepairRecords] = useState([]);
    const [reportType, setReportType] = useState('equipment');
    const [selectedWorkshop, setSelectedWorkshop] = useState('all');
    const userrole = useSelector((state) => state.role.userrole);

    useEffect(() => {
        fetchData();
    }, [reportType, selectedWorkshop]);

    const fetchData = async () => {
        try {
            const [equipmentResponse, recordsResponse] = await Promise.all([
                axios.get('http://localhost:5000/equipments'),
                axios.get('http://localhost:5000/repairRecords')
            ]);

            const equipmentData = equipmentResponse.data;
            const recordsData = recordsResponse.data;

            setEquipmentData(equipmentData);

            const combinedRepairRecords = recordsData.map((record) => {
                const correspondingEquipment = equipmentData.find((equipment) => equipment.inventoryNumber === record.inventoryNumber);
                return {
                    ...record,
                    workshop: correspondingEquipment ? correspondingEquipment.workshop : 'N/A'
                };
            });

            setRepairRecords(combinedRepairRecords);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const workshops = Array.from(new Set(equipmentData.map((equipment) => equipment.workshop)));

    const exportToTxt = () => {
        const fileType = 'text/plain;charset=UTF-8';
        const fileExtension = '.txt';

        let filteredData = [];

        if (reportType === 'equipment') {
            filteredData = equipmentData.filter((equipment) => selectedWorkshop === 'all' || equipment.workshop === selectedWorkshop);
        } else if (reportType === 'repairs') {
            filteredData = repairRecords.filter((repair) => selectedWorkshop === 'all' || repair.workshop === selectedWorkshop);
        }

        const headerLines = [
            new Date().toLocaleString(),
            `Отчет по: ${reportType}`,
            `Цех: ${selectedWorkshop}`
        ];

        let txtData = [...headerLines];

        if (reportType === 'equipment') {
            txtData.push('inventoryNumber\tlastMaintenanceDate\tmanufacturer\tneedsRepair\tpowerConsumption\tworkshop');
            txtData.push(...filteredData.map((item) => `${item.inventoryNumber}\t${item.lastMaintenanceDate}\t${item.manufacturer}\t${item.needsRepair}\t${item.powerConsumption}\t${item.workshop}`));
        } else if (reportType === 'repairs') {
            txtData.push('inventoryNumber\tdate\tcost\tdescription\tworkshop');
            txtData.push(...filteredData.map((item) => `${item.inventoryNumber}\t${item.date}\t${item.cost}\t${item.description}\t${item.workshop}`));
        }

        const txtBlob = new Blob([txtData.join('\n')], { type: fileType });
        FileSaver.saveAs(txtBlob, `report_${reportType}_${selectedWorkshop}${fileExtension}`);
    };



    const exportToExcel = () => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';

        let filteredData = [];
        if (reportType === 'equipment') {
            filteredData = equipmentData.filter((equipment) => selectedWorkshop === 'all' || equipment.workshop === selectedWorkshop);
        } else if (reportType === 'repairs') {
            filteredData = repairRecords.filter((repair) => selectedWorkshop === 'all' || repair.workshop === selectedWorkshop);
        }

        let selectedColumnsData = [];
        if (reportType === 'equipment') {
            selectedColumnsData = filteredData.map(({ inventoryNumber, lastMaintenanceDate, manufacturer, needsRepair, powerConsumption, workshop }) => ({
                'inventoryNumber': inventoryNumber,
                'lastMaintenanceDate': lastMaintenanceDate,
                'manufacturer': manufacturer,
                'needsRepair': needsRepair,
                'powerConsumption': powerConsumption,
                'workshop': workshop,
            }));
        } else if (reportType === 'repairs') {
            selectedColumnsData = filteredData.map(({ inventoryNumber, date, cost, description, workshop }) => ({
                'inventoryNumber': inventoryNumber,
                'date': date,
                'cost': cost,
                'description': description,
                'workshop': workshop,
            }));
        }

        const ws = XLSX.utils.json_to_sheet(selectedColumnsData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(dataBlob, `report_${reportType}_${selectedWorkshop}${fileExtension}`);
    };


    const PDFDocument = () => {
        let filteredData = [];
        if (reportType === 'equipment') {
            filteredData = equipmentData.filter((equipment) => selectedWorkshop === 'all' || equipment.workshop === selectedWorkshop);
        } else if (reportType === 'repairs') {
            filteredData = repairRecords.filter((repair) => selectedWorkshop === 'all' || repair.workshop === selectedWorkshop);
        }
        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Text style={styles.header}>Отчет</Text>
                        <View style={styles.table}>
                            <View style={styles.row}>
                                {reportType === 'equipment' && (
                                    <>
                                        <Text style={styles.row1}>inventoryNumber</Text>
                                        <Text style={styles.row2}>lastMaintenanceDate</Text>
                                        <Text style={styles.row3}>manufacturer</Text>
                                        <Text style={styles.row4}>needsRepair</Text>
                                        <Text style={styles.row5}>powerConsumption</Text>
                                        <Text style={styles.row6}>workshop</Text>
                                    </>
                                )}
                                {reportType === 'repairs' && (
                                    <>
                                        <Text style={styles.row1}>inventoryNumber</Text>
                                        <Text style={styles.row2}>date</Text>
                                        <Text style={styles.row3}>cost</Text>
                                        <Text style={styles.row4}>description</Text>
                                        <Text style={styles.row5}>workshop</Text>
                                    </>
                                )}
                            </View>
                            {filteredData && reportType === 'equipment' &&
                                filteredData.map((item) => (
                                    <View key={item.id} style={styles.row}>
                                        <Text style={styles.row1}>{item.inventoryNumber}</Text>
                                        <Text style={styles.row2}>{item.lastMaintenanceDate}</Text>
                                        <Text style={styles.row3}>{item.manufacturer}</Text>
                                        <Text style={styles.row4}>{item.needsRepair ? 'да' : 'нет'}</Text>
                                        <Text style={styles.row5}>{item.powerConsumption}</Text>
                                        <Text style={styles.row6}>{item.workshop}</Text>
                                    </View>
                                ))}
                            {filteredData && reportType === 'repairs' &&
                                filteredData.map((item) => (
                                    <View key={item.id} style={styles.row}>
                                        <Text style={styles.row1}>{item.inventoryNumber}</Text>
                                        <Text style={styles.row2}>{item.date}</Text>
                                        <Text style={styles.row3}>{item.cost}</Text>
                                        <Text style={styles.row4}>{item.description}</Text>
                                        <Text style={styles.row5}>{item.workshop}</Text>
                                    </View>
                                ))}
                        </View>
                    </View>
                </Page>
            </Document>
        );
    };

    Font.register({
        family: "Roboto",
        src:
            "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf"
    });

    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            fontFamily: "Roboto",
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1,
            width: '100%',
        },
        header: {
            fontWeight: 'bold',
            fontSize: 25,
            marginBottom: 10,
        },
        podp: {
            fontSize: 14,
            textAlign: 'right',
            marginTop: 20,
        },
        row: {
            display: 'flex',
            flexDirection: 'row',
            borderTop: '1px solid #EEE',
            paddingTop: 8,
            paddingBottom: 8,
        },
        row1: {
            width: '17%',
        },
        row2: {
            width: '17%',
        },
        row3: {
            width: '17%',
        },
        row4: {
            width: '17%',
        },
        row5: {
            width: '17%',
        },
        row6: {
            width: '17%',
        },
        row7: {
            width: '17%',
        },
    });

    return (
        <div className='ReportsContainer'>
            {(userrole === 'admin' || userrole === 'master') && (
                <div>
                    <p>Получить отчет по:</p>
                    <label>
                        <input
                            type="radio"
                            value="equipment"
                            checked={reportType === 'equipment'}
                            onChange={() => setReportType('equipment')}
                        />
                        Оборудованию
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="repairs"
                            checked={reportType === 'repairs'}
                            onChange={() => setReportType('repairs')}
                        />
                        Ремонтам
                    </label>

                    {userrole === 'admin' && (
                        <div>
                            <p>Получить отчет по цеху:</p>
                            <select value={selectedWorkshop} onChange={(e) => setSelectedWorkshop(e.target.value)}>
                                <option value="all">По всем</option>
                                {workshops.map((workshop) => (
                                    <option key={workshop} value={workshop}>{workshop}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button onClick={() => exportToTxt()}>Экспорт в TXT</button>
                </div>
            )}

            {userrole !== 'admin' && userrole !== 'master' && (
                <p>У вас нет прав для просмотра отчетов</p>
            )}

            <button onClick={() => exportToExcel()}>Экспорт в Excel</button>

            <PDFDownloadLink document={<PDFDocument />} fileName={`repair.pdf`}>
                {({ blob, url, loading, error }) => (
                    <button disabled={loading} onClick={loading ? null : () => { }}>
                        {loading ? 'Loading document...' : 'Export to PDF'}
                    </button>
                )}
            </PDFDownloadLink>

            <PDFViewer width="100%" height="800px">
                <PDFDocument />
            </PDFViewer>

        </div>
    );
};

export default Reports;
