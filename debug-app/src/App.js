import PersonS from "./components/PersonS";
import PersonM from "./components/PersonM";

export default function App() {
  return (
    <div>
      <PersonS name="jmeno" lastname="prijmeni"></PersonS>
      <br/>
      <PersonM></PersonM>
    </div>
  );
}