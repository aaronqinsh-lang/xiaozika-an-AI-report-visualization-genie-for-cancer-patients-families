
export const MEMOS_CONFIG = {
  USER_ID: "sam.qin@xiaoyibao.com.cn",
  API_KEY: "mpg-XTF8X0lKOJVUpewkyvdL1GwR1T7MebYrgzJ3zhWo",
  BASE_URL: "https://memos.memtensor.cn/api/openmem/v1"
};

export const INITIAL_RECORDS = [
  { id: '1', date: '2023-11-01', type: 'Tumor', indicators: { 'CEA': 3.2, 'CA19-9': 22 } },
  { id: '2', date: '2023-12-05', type: 'Tumor', indicators: { 'CEA': 4.5, 'CA19-9': 28 } },
  { id: '3', date: '2024-01-10', type: 'Tumor', indicators: { 'CEA': 2.1, 'CA19-9': 18 } },
];

export const CSV_TEMPLATE_HEADER = "日期,类型,指标名称1,指标值1,指标名称2,指标值2";
export const CSV_TEMPLATE_EXAMPLE = "2024-02-15,Tumor,CEA,1.8,CA19-9,15.5";

export const INDICATOR_METADATA = [
  { key: 'CEA', label: '癌胚抗原', unit: 'ng/mL' },
  { key: 'CA19-9', label: '糖类抗原', unit: 'U/mL' },
  { key: 'WBC', label: '白细胞', unit: '10^9/L' },
  { key: 'CRP', label: 'C反应蛋白', unit: 'mg/L' }
];
