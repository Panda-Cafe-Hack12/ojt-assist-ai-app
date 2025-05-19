import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
// import { sendMail } from '@/utils/sendMail'; // メール送信ユーティリティ（仮）
import { User }  from '../../../types/user'; // ユーザー型定義（仮）
import { Employee }  from '../../../types/employee'; // ユーザー型定義（仮）
import { use } from 'react';


export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('ユーザー情報の取得に失敗しました:', userError);
      return null;
    }

    const { data, error: usersError } = await supabase
    .from('users')
    .select('*')
    .eq('organization_id', user.user_metadata.organization_id);
   
  
    console.log("ユーザープロフィールを取得: ");
    console.log(data);

    if (usersError || !data) {
      console.error('ユーザープロフィールの取得に失敗しました:', usersError);
      return null;
    }

    const users: User[] = data as User[];

    const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('*');

    console.log("ロールを取得: ");
    console.log(roles);

    if (rolesError || !roles) {
      console.error('ロールの取得に失敗しました:', rolesError);
      return null;
    }

    const { data: departments, error: departmentsError } = await supabase
    .from('departments')
    .select('*');
     
    console.log("部署・チームを取得: ");
    console.log(departments);

    if (departmentsError || !departments) {
      console.error('部署・チームの取得に失敗しました:', departmentsError);
      return null;
    }
    const employees: Employee[] = []; 
    users.forEach((publicUser) => {
      const employee: Employee = {
        id: publicUser.id,        
        name: publicUser.name,
        email: publicUser.email,
        organization_id: publicUser.organization_id,
        organization_name: user.user_metadata.organization_name,
        department_id: publicUser.department_id,
        department_name: '',
        role_id: publicUser.role_id,
        role_name: '',
        training_data_id: publicUser.training_data_id,
      };
      const role = roles.find((role) => role.id === employee.role_id);
      if (role) {
        employee.role_name = role.name;
      } else {
        console.error(`ロールが見つかりません: ID ${employee.role_id}`);
      }
      const department = departments.find((department) => department.id === employee.department_id);
      if (department) {
        employee.department_name = department.name;
      } else {
        console.error(`所属部署が見つかりません: ID ${employee.department_id}`);
      }
      employees.push(employee);
    });

    console.log("社員情報を取得: " + employees.length + " 件");
    
    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: '取得処理でエラーが発生しました' }, { status: 500 });
  }
} 