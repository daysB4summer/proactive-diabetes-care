import {
  models,
  selectedModel,
  bmi,
  bmiCategory,
  bpCategory,
  recommendations,
  riskBand,
  riskScore,
  type Patient,
} from "./health";

export function downloadReport(patient: Patient) {
  const bmiValue = bmi(patient.heightCm, patient.weightKg);
  const bmiInfo = bmiCategory(bmiValue);
  const bpInfo = bpCategory(patient.systolic, patient.diastolic);
  const score = riskScore(patient);
  const band = riskBand(score);
  const tips = recommendations(patient);

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>HealthGuard AI Report</title>
<style>body{font-family:Inter,Arial,sans-serif;color:#33304a;margin:48px;line-height:1.6}
h1{font-size:24px;margin:0}h2{font-size:14px;text-transform:uppercase;letter-spacing:.12em;color:#6b6885;margin-top:32px}
table{width:100%;border-collapse:collapse;margin-top:8px}td{padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
li{font-size:14px}</style></head><body>
<h1>HealthGuard AI — Health Report</h1>
<p style="color:#6b6885;font-size:13px">${patient.name} · Generated ${new Date().toLocaleString()}</p>
<h2>Diabetes risk</h2><p style="font-size:32px;margin:0"><strong>${score}/100</strong> — ${band.label}</p>
<p style="font-size:13px;color:#6b6885">Model: ${models.map((m) => `${m.name} ${(m.accuracy * 100).toFixed(1)}%`).join(" vs ")} — trained on the real Pima Indians Diabetes dataset (768 records); ${selectedModel.name} selected.</p>
<h2>Patient profile</h2><table>
<tr><td>Age</td><td align="right">${patient.age}</td></tr>
<tr><td>Gender</td><td align="right">${patient.gender}</td></tr>
<tr><td>Height</td><td align="right">${patient.heightCm} cm</td></tr>
<tr><td>Weight</td><td align="right">${patient.weightKg} kg</td></tr>
<tr><td>BMI</td><td align="right">${bmiValue.toFixed(1)} (${bmiInfo.label})</td></tr>
<tr><td>Blood pressure</td><td align="right">${patient.systolic}/${patient.diastolic} mmHg (${bpInfo.label})</td></tr>
<tr><td>Fasting glucose</td><td align="right">${patient.glucose} mg/dL</td></tr>
<tr><td>Family history</td><td align="right">${patient.familyHistory ? "Yes" : "No"}</td></tr>
</table>
<h2>Recommendations</h2><ul>${tips.map((t) => `<li>${t}</li>`).join("")}</ul>
<p style="margin-top:40px;font-size:12px;color:#9a97ad">For demonstration only — not medical advice.</p>
<script>window.onload=()=>window.print()<\/script></body></html>`;

  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}
