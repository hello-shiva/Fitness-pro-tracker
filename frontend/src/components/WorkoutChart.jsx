import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function WorkoutChart({ data }) {
  if (!data || data.length === 0) {
      return <p className="text-center text-muted mt-4">No data available for the chart yet. Log a workout!</p>;
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-dark text-white fw-bold">
        📊 Weekly Fitness Progress
      </div>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
            <XAxis dataKey="day" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="caloriesBurned" name="Calories Burned (kcal)" barSize={40} fill="#413ea0" />
            <Line type="monotone" dataKey="duration" name="Duration (Mins)" stroke="#ff7300" strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}