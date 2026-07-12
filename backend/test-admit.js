async function testFlow() {
  try {
    console.log('1. Creating a Lead...');
    const createRes = await fetch('http://localhost:5000/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filler_type: 'student',
        full_name: 'Test Student Tran',
        email: 'tran' + Date.now() + '@example.com',
        mobile_number: '9876543210',
        city: 'Mumbai',
        interested_course_id: '60d5ecb54d63421111111111'
      })
    });
    const leadData = await createRes.json();
    console.log('Lead creation response:', leadData);

    if (!leadData.success) {
      console.log('Failed to create lead, stopping test.');
      return;
    }

    const leadId = leadData.data.id || leadData.data._id;
    console.log('Created Lead ID:', leadId);

    console.log('2. Admitting Lead...');
    const admitRes = await fetch('http://localhost:5000/api/v2/students/admit/' + leadId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formData: {
          studentName: 'Test Student Tran',
          fatherName: 'Papa Tran',
          motherName: 'Mama Tran',
          email: 'tran' + Date.now() + '@example.com',
          phone: '9876543210',
          dob: '2005-01-01',
          gender: 'Male',
          courseSelected: '60d5ecb54d63421111111111'
        }
      })
    });
    const admitData = await admitRes.json();
    console.log('Admit Lead response:', admitData);

  } catch (err) {
    console.error(err);
  }
}
testFlow();
