from models.user import User

print("Testing authentication...")
result = User.authenticate_user('candidate@codevail.com', 'Candidate123')
print('Auth result:', result)
if result:
    print('✅ Authentication WORKS!')
else:
    print('❌ Authentication FAILED')
