type Props = {
  messages: any;
};

export default function messages({ messages }: Props) {
  return (
    <ul>
      {messages.map((item: any, index: number) => (
        <li key={index} className={item.role === 'assistant' ? 'sb1' : 'sb2'}>
          {item.content}
        </li>
      ))}
    </ul>
  );
}
