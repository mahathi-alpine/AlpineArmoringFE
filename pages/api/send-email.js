import { sendEmail } from '../../hooks/aws-ses';
export default async function checkUserAPI(request, response) {
  const result = await sendEmail('test@test.com');
  response.json(result);
}
