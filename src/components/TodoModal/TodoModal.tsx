import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { actions as currentTodoActions } from '../../features/currentTodo';
import { User } from '../../types/User';
import { getUser } from '../../api';

export const TodoModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentTodo = useAppSelector(state => state.currentTodo);

  useEffect(() => {
    if (currentTodo) {
      setIsLoading(true);

      getUser(currentTodo.userId)
        .then(setUser)
        .finally(() => setIsLoading(false));
    }
  }, [currentTodo]);

  const removeCurrentTodo = () => {
    dispatch(currentTodoActions.removeTodo());
  };

  return (
    <>
      {currentTodo && (
        <div className="modal is-active" data-cy="modal">
          <div className="modal-background" />
          {isLoading
            ? (<Loader />)
            : user && (
              <div className="modal-card">
                <header className="modal-card-head">
                  <div
                    className="modal-card-title has-text-weight-medium"
                    data-cy="modal-header"
                  >
                    {`Todo #${currentTodo.id}`}
                  </div>

                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    type="button"
                    className="delete"
                    data-cy="modal-close"
                    onClick={() => removeCurrentTodo()}
                  />
                </header>

                <div className="modal-card-body">
                  <p className="block" data-cy="modal-title">
                    {currentTodo.title}
                  </p>

                  <p className="block" data-cy="modal-user">
                    {currentTodo.completed
                      ? (
                        <strong className="has-text-success">Done</strong>
                      )
                      : (
                        <strong className="has-text-danger">Planned</strong>
                      )}
                    {' by '}
                    <a href={`mailto:${user.email}`}>{user.name}</a>
                  </p>
                </div>
              </div>
            )}
        </div>
      )}
    </>
  );
};
