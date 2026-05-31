function Dashboard() {
  const [pets, setPets] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    setPets(getPets());
  }, []);

  const addPet = () => {
    const newPets = [...pets, { id: Date.now(), name, age }];
    setPets(newPets);
    savePets(newPets);
    setName("");
    setAge("");
  };

  const deletePet = (id) => {
    const filtered = pets.filter((p) => p.id !== id);
    setPets(filtered);
    savePets(filtered);
  };

  return (
    <div className="dashboard">
      <h2>Pet Adoption Dashboard</h2>

      <div className="form">
        <input placeholder="Pet name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <button onClick={addPet}>Add Pet</button>
      </div>

      <ul>
        {pets.map((p) => (
          <li key={p.id}>
            {p.name} ({p.age} years)
            <button onClick={() => deletePet(p.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;