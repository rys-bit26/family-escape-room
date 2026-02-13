import { Modal } from '../common/Modal.tsx';
import { useUiStore, getExamineDescription } from '../../store/uiStore.ts';

export function ObjectExamine() {
  const examineObjectId = useUiStore((s) => s.examineObjectId);
  const closeExamine = useUiStore((s) => s.closeExamine);

  if (!examineObjectId) return null;

  const description = getExamineDescription();

  return (
    <Modal onClose={closeExamine} title="Examine">
      <p className="text-gray-200 text-lg leading-relaxed">{description}</p>
    </Modal>
  );
}
