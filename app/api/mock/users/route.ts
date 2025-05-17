// app/api/mock/users/route.ts
import { NextResponse } from 'next/server';
import mockData, { User } from '@/data/mockData'; // `@` は `tsconfig.json` の `paths` 設定によります

// export async function GET(request: Request) {
//   // クエリパラメータの取得 (例: IDによるフィルタリング)
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get('id');

//   if (id) {
//     const user = mockData.users.find((p) => p.id === id);
//     if (user) {
//       return NextResponse.json(user);
//     } else {
//       return new NextResponse(JSON.stringify({ message: 'User not found' }), {
//         status: 404,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   }

//   // ID が指定されていない場合は全ユーザーを返す
//   return NextResponse.json(mockData.users);
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const newUser: User = {
//       id: `user-${Date.now()}`, // 簡単なID生成
//       ...body,
//     };
//     mockData.users.push(newUser);
//     return NextResponse.json(newUser, { status: 201 });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     return new NextResponse(JSON.stringify({ message: 'Failed to create user' }), {
//       status: 400,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }

// GET all users
export async function GET() {
  return NextResponse.json(mockData.users);
}

// POST a new user
export async function POST(request: Request) {
  try {
    const body: Omit<User, 'id'> = await request.json();
    const newUser = mockData.addUser(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to create user' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// DELETE a user by ID
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse(JSON.stringify({ message: 'Missing user ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isDeleted = mockData.deleteUserById(id);

  if (isDeleted) {
    return new NextResponse(null, { status: 204 }); // No Content
  } else {
    return new NextResponse(JSON.stringify({ message: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// PUT (update) a user by ID
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new NextResponse(JSON.stringify({ message: 'Missing user ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: Omit<User, 'id'> = await request.json();
    const updatedUser = mockData.updateUserById(id, body);

    if (updatedUser) {
      return NextResponse.json(updatedUser);
    } else {
      return new NextResponse(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to update user' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// GET a single user by ID (separate route for clarity)
export async function GET_BY_ID(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const user = mockData.findUserById(id);

  if (user) {
    return NextResponse.json(user);
  } else {
    return new NextResponse(JSON.stringify({ message: 'User not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
